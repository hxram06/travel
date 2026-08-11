import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAvHvsHweGp39e_a9IdgJyQWB8fdfJG_Fc',
  authDomain: 'deuschland-ca215.firebaseapp.com',
  projectId: 'deuschland-ca215',
  storageBucket: 'deuschland-ca215.firebasestorage.app',
  messagingSenderId: '228320878330',
  appId: '1:228320878330:web:ba30dd3054ff57c7c7b343',
  measurementId: 'G-QSBSY72V4V',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const reactionCache = new Map();
const pendingReads = new Map();
let activeUser = null;

function feedbackDocId(uid, stepKey) {
  return `${uid}__${stepKey}`;
}

function groupsForKey(stepKey) {
  return [...document.querySelectorAll('.timeline-feedback')]
    .filter((group) => group.dataset.feedbackKey === stepKey);
}

function paintReaction(stepKey, reaction, saving = false) {
  groupsForKey(stepKey).forEach((group) => {
    group.dataset.feedbackState = reaction || '';
    group.classList.toggle('is-saving', saving);
    group.querySelectorAll('.feedback-button').forEach((button) => {
      const selected = button.dataset.reaction === reaction;
      button.disabled = !activeUser || saving;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  });
}

function markUnavailable(message) {
  document.documentElement.dataset.feedbackStatus = 'error';
  document.querySelectorAll('.timeline-feedback').forEach((group) => {
    group.title = message;
    group.querySelectorAll('.feedback-button').forEach((button) => { button.disabled = true; });
  });
}

async function loadReaction(group) {
  if (!activeUser || !group) return;
  const stepKey = group.dataset.feedbackKey;
  if (!stepKey) return;
  if (reactionCache.has(stepKey)) {
    paintReaction(stepKey, reactionCache.get(stepKey));
    return;
  }
  if (!pendingReads.has(stepKey)) {
    pendingReads.set(stepKey, getDoc(doc(db, 'timelineFeedback', feedbackDocId(activeUser.uid, stepKey)))
      .then((snapshot) => snapshot.exists() ? snapshot.data().reaction : null)
      .then((reaction) => {
        reactionCache.set(stepKey, reaction);
        return reaction;
      })
      .finally(() => pendingReads.delete(stepKey)));
  }
  try {
    const reaction = await pendingReads.get(stepKey);
    paintReaction(stepKey, reaction);
  } catch (error) {
    console.error('기존 일정 평가 조회 오류', error);
    markUnavailable('평가를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
  }
}

function hydrateFeedback(root = document) {
  if (!activeUser) return;
  const groups = [];
  if (root.nodeType === Node.ELEMENT_NODE && root.matches?.('.timeline-feedback')) groups.push(root);
  root.querySelectorAll?.('.timeline-feedback').forEach((group) => groups.push(group));
  groups.forEach(loadReaction);
}

async function saveReaction(group, requestedReaction) {
  if (!activeUser || !group || !['like', 'dislike'].includes(requestedReaction)) return;
  const stepKey = group.dataset.feedbackKey;
  const previousReaction = reactionCache.get(stepKey) || null;
  const nextReaction = previousReaction === requestedReaction ? null : requestedReaction;
  const reference = doc(db, 'timelineFeedback', feedbackDocId(activeUser.uid, stepKey));

  reactionCache.set(stepKey, nextReaction);
  paintReaction(stepKey, nextReaction, true);
  try {
    if (nextReaction) {
      await setDoc(reference, {
        uid: activeUser.uid,
        stepKey,
        courseId: Number(group.dataset.courseId),
        dayNumber: Number(group.dataset.dayNumber),
        timelineIndex: Number(group.dataset.timelineIndex),
        reaction: nextReaction,
        updatedAt: serverTimestamp(),
      });
    } else {
      await deleteDoc(reference);
    }
    paintReaction(stepKey, nextReaction);
  } catch (error) {
    reactionCache.set(stepKey, previousReaction);
    paintReaction(stepKey, previousReaction);
    console.error('일정 평가 저장 오류', error);
    groupsForKey(stepKey).forEach((item) => {
      item.classList.add('has-error');
      item.title = '저장하지 못했습니다. Firebase 권한과 연결 상태를 확인해주세요.';
      window.setTimeout(() => item.classList.remove('has-error'), 1600);
    });
  }
}

async function loadCourseStats(courseId) {
  if (!activeUser) throw new Error('평가 서비스에 아직 연결되지 않았습니다.');
  const snapshot = await getDocs(query(
    collection(db, 'timelineFeedback'),
    where('courseId', '==', Number(courseId)),
  ));
  const voters = new Set();
  const steps = new Map();
  let likes = 0;
  let dislikes = 0;

  snapshot.forEach((record) => {
    const value = record.data();
    if (!['like', 'dislike'].includes(value.reaction)) return;
    voters.add(value.uid);
    if (value.reaction === 'like') likes++;
    else dislikes++;
    const current = steps.get(value.stepKey) || {
      stepKey: value.stepKey,
      dayNumber: value.dayNumber,
      timelineIndex: value.timelineIndex,
      likes: 0,
      dislikes: 0,
      total: 0,
    };
    current[value.reaction === 'like' ? 'likes' : 'dislikes']++;
    current.total++;
    steps.set(value.stepKey, current);
  });

  return {
    total: likes + dislikes,
    likes,
    dislikes,
    voters: voters.size,
    steps: [...steps.values()],
  };
}

function lodgingVoteDocId(uid, courseId) {
  return `${uid}__course-${Number(courseId)}`;
}

async function loadLodgingVote(courseId) {
  if (!activeUser) throw new Error('설문 서비스에 아직 연결되지 않았습니다.');
  const snapshot = await getDoc(doc(db, 'lodgingSurvey', lodgingVoteDocId(activeUser.uid, courseId)));
  if (!snapshot.exists()) return null;
  const optionId = snapshot.data().optionId;
  return ['buddy', 'brunnenhof', 'airbnb'].includes(optionId) ? optionId : null;
}

async function saveLodgingVote(courseId, optionId) {
  if (!activeUser) throw new Error('설문 서비스에 아직 연결되지 않았습니다.');
  if (!['buddy', 'brunnenhof', 'airbnb'].includes(optionId)) {
    throw new Error('유효하지 않은 숙소 선택입니다.');
  }
  await setDoc(doc(db, 'lodgingSurvey', lodgingVoteDocId(activeUser.uid, courseId)), {
    uid: activeUser.uid,
    courseId: Number(courseId),
    optionId,
    updatedAt: serverTimestamp(),
  });
}

async function loadLodgingSurveyStats(courseId) {
  if (!activeUser) throw new Error('설문 서비스에 아직 연결되지 않았습니다.');
  const snapshot = await getDocs(query(
    collection(db, 'lodgingSurvey'),
    where('courseId', '==', Number(courseId)),
  ));
  const options = { buddy: 0, brunnenhof: 0, airbnb: 0 };
  const voters = new Set();
  snapshot.forEach((record) => {
    const value = record.data();
    if (!(value.optionId in options)) return;
    options[value.optionId]++;
    voters.add(value.uid);
  });
  return { voters: voters.size, options };
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('.feedback-button');
  if (!button || button.disabled) return;
  event.preventDefault();
  event.stopPropagation();
  saveReaction(button.closest('.timeline-feedback'), button.dataset.reaction);
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => hydrateFeedback(node)));
});
observer.observe(document.body, { childList: true, subtree: true });

window.TravelFeedback = {
  loadCourseStats,
  loadLodgingVote,
  saveLodgingVote,
  loadLodgingSurveyStats,
};

try {
  await setPersistence(auth, browserLocalPersistence);
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error('Firebase 익명 로그인 오류', error);
        markUnavailable('익명 로그인을 사용할 수 없습니다. Firebase Authentication 설정을 확인해주세요.');
        window.dispatchEvent(new CustomEvent('travel-feedback-error', { detail: error.message }));
      }
      return;
    }
    activeUser = user;
    document.documentElement.dataset.feedbackStatus = 'ready';
    hydrateFeedback(document);
    window.dispatchEvent(new Event('travel-feedback-ready'));
  });
} catch (error) {
  console.error('Firebase 평가 기능 초기화 오류', error);
  markUnavailable('평가 서비스를 초기화하지 못했습니다.');
  window.dispatchEvent(new CustomEvent('travel-feedback-error', { detail: error.message }));
}
