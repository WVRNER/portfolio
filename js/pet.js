/**
 * Deploy Pet Widget
 * 
 * Fetches latest commit date once on page load from the public GitHub API:
 * https://github.com/wvrner/portfolio
 * 
 * Mood Rules:
 * - < 24 hours: happy and well fed
 * - 1 to 7 days: content but getting hungry
 * - 7 to 30 days: hungry and sleepy
 * - > 30 days: asleep with zzz
 * 
 * Constraints:
 * - Fetches once on page load; caches result in a JS variable. Zero polling.
 * - If fetch fails or rate limited, displays neutral state: "The pet is napping, check back soon".
 * - Renders all text with textContent only, never innerHTML.
 * - Zero cookies, zero localStorage, zero external tracking.
 * - Interactive pointerdown bounce and heart animation.
 */
(function initDeployPet() {
  // In-memory cache variable (never refetches or polls)
  let cachedCommitData = null;

  const widgetEl = document.getElementById('deployPetWidget');
  const petBtn = document.getElementById('petInteractiveBtn');
  const statusTextEl = document.getElementById('petStatusText');
  const moodBadgeEl = document.getElementById('petMoodBadge');
  const heartBubbleEl = document.getElementById('petHeartBubble');

  if (!widgetEl || !petBtn || !statusTextEl || !moodBadgeEl) return;

  // Pointer interaction: bounce and floating heart
  let isAnimating = false;
  petBtn.addEventListener('pointerdown', function handlePetInteraction(e) {
    // Cosmetic only: does not affect real commit data
    if (isAnimating) return;
    isAnimating = true;

    widgetEl.classList.add('is-petting');
    if (heartBubbleEl) {
      heartBubbleEl.classList.remove('animate-heart');
      // Trigger DOM reflow to restart CSS animation
      void heartBubbleEl.offsetWidth;
      heartBubbleEl.classList.add('animate-heart');
    }

    setTimeout(() => {
      widgetEl.classList.remove('is-petting');
      isAnimating = false;
    }, 600);
  });

  // Neutral Fallback State (Network offline, rate limited, or API error)
  function setNeutralState() {
    widgetEl.className = 'deploy-pet-widget mood-napping';
    moodBadgeEl.textContent = 'Napping';
    statusTextEl.textContent = 'The pet is napping, check back soon';
    petBtn.setAttribute('aria-label', 'Deploy Pet is napping. Tap to wake or pet.');
  }

  // Update Pet UI based on commit time difference
  function updatePetMood(commitDate) {
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - commitDate.getTime());
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      // Under 24 hours: Happy & well-fed
      widgetEl.className = 'deploy-pet-widget mood-happy';
      moodBadgeEl.textContent = 'Well fed';
      if (diffHours < 1) {
        statusTextEl.textContent = 'Last fed just now (my latest commit)';
      } else {
        const hrs = Math.floor(diffHours);
        statusTextEl.textContent = 'Last fed ' + hrs + (hrs === 1 ? ' hour' : ' hours') + ' ago (my latest commit)';
      }
      petBtn.setAttribute('aria-label', 'Deploy Pet is happy and well-fed! Latest commit was within 24 hours.');
    } else if (diffDays <= 7) {
      // 1 to 7 days: Content but getting hungry
      widgetEl.className = 'deploy-pet-widget mood-content';
      moodBadgeEl.textContent = 'Content';
      statusTextEl.textContent = 'Last fed ' + diffDays + (diffDays === 1 ? ' day' : ' days') + ' ago (my latest commit)';
      petBtn.setAttribute('aria-label', 'Deploy Pet is content but getting hungry. Latest commit was ' + diffDays + ' days ago.');
    } else if (diffDays <= 30) {
      // 7 to 30 days: Hungry & sleepy
      widgetEl.className = 'deploy-pet-widget mood-hungry';
      moodBadgeEl.textContent = 'Hungry';
      statusTextEl.textContent = 'Last fed ' + diffDays + ' days ago (my latest commit)';
      petBtn.setAttribute('aria-label', 'Deploy Pet is hungry and sleepy. Latest commit was ' + diffDays + ' days ago.');
    } else {
      // Over 30 days: Asleep with zzz
      widgetEl.className = 'deploy-pet-widget mood-asleep';
      moodBadgeEl.textContent = 'Asleep';
      statusTextEl.textContent = 'Last fed ' + diffDays + ' days ago (my latest commit)';
      petBtn.setAttribute('aria-label', 'Deploy Pet is fast asleep with zzz. Latest commit was over 30 days ago.');
    }
  }

  // Fetch once on page load
  async function loadDeployPet() {
    if (cachedCommitData) {
      updatePetMood(cachedCommitData);
      return;
    }

    try {
      const controller = window.AbortController ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

      const response = await fetch('https://api.github.com/repos/wvrner/portfolio/commits?per_page=1', {
        headers: { 'Accept': 'application/vnd.github.v3+json' },
        signal: controller ? controller.signal : undefined
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        setNeutralState();
        return;
      }

      const commits = await response.json();
      if (!Array.isArray(commits) || commits.length === 0 || !commits[0].commit) {
        setNeutralState();
        return;
      }

      const dateStr = commits[0].commit.committer?.date || commits[0].commit.author?.date;
      if (!dateStr) {
        setNeutralState();
        return;
      }

      // Cache once in memory
      cachedCommitData = new Date(dateStr);
      updatePetMood(cachedCommitData);
    } catch (err) {
      setNeutralState();
    }
  }

  // Execute once
  loadDeployPet();
})();
