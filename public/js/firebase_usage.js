var MAX_REASONABLE_BATCH_SIZE = 100000;

function sanitizePositiveInt(value, maxLimit) {
  var num = parseInt(value, 10);
  if (isNaN(num) || !isFinite(num) || num <= 0) {
    return 0;
  }
  var limit = maxLimit || MAX_REASONABLE_BATCH_SIZE;
  return Math.min(Math.floor(num), limit);
}

function safeIncrement(current, delta) {
  var safeCurrent = (typeof current === 'number' && isFinite(current) && current >= 0) ? Math.floor(current) : 0;
  var safeDelta = (typeof delta === 'number' && isFinite(delta) && delta > 0) ? Math.floor(delta) : 0;
  return safeCurrent + safeDelta;
}

function badgeYearPrefixKey(key) {
  return new Date().getFullYear() + '/' + key;
}

var badgeUsageTrackingProductionHosts = [
  'devfestbadge.web.app',
  'devfestbadge.firebaseapp.com'
];

function isBadgeUsageTrackingEnabled() {
  var params = new URLSearchParams(window.location.search);
  var override = params.get('usageTracking');
  if (override === 'on') return true;
  if (override === 'off') return false;

  return badgeUsageTrackingProductionHosts.indexOf(window.location.hostname) !== -1;
}

function canWriteBadgeUsage() {
  return isBadgeUsageTrackingEnabled() && window.firebase && window.firebase.database;
}

function canReadBadgeUsage() {
  return window.firebase && window.firebase.database;
}

function readBadgeTotalCount(updateUI) {
  if (!canReadBadgeUsage()) return;

  window.firebase.database().ref(badgeYearPrefixKey('usage/badges/totalBadges')).once('value').then(function (snapshot) {
    var rawVal = snapshot ? snapshot.val() : 0;
    var safeVal = (typeof rawVal === 'number' && isFinite(rawVal) && rawVal >= 0) ? Math.floor(rawVal) : 0;
    if (typeof updateUI === 'function') updateUI(safeVal);
  }).catch(function () {
    if (typeof updateUI === 'function') updateUI(0);
  });
}

function trackBadgeSiteVisit() {
  if (!canWriteBadgeUsage()) return;

  window.firebase.database().ref(badgeYearPrefixKey('usage/badges/siteVisits')).transaction(function (count) {
    return safeIncrement(count, 1);
  });
}

function trackBadgeFileUpload(validCount) {
  if (!canWriteBadgeUsage()) return;

  var safeRows = sanitizePositiveInt(validCount);
  if (safeRows <= 0) return;

  window.firebase.database().ref(badgeYearPrefixKey('usage/badges/fileUploads')).transaction(function (count) {
    return safeIncrement(count, 1);
  });
  window.firebase.database().ref(badgeYearPrefixKey('usage/badges/uploadedRows')).transaction(function (count) {
    return safeIncrement(count, safeRows);
  });
}

function trackBadgesGenerated(count, updateUI) {
  if (!canWriteBadgeUsage()) return;

  var safeCount = sanitizePositiveInt(count);
  if (safeCount <= 0) return;

  var totalRef = window.firebase.database().ref(badgeYearPrefixKey('usage/badges/totalBadges'));
  totalRef.transaction(function (current) {
    return safeIncrement(current, safeCount);
  }, function (error, committed, snapshot) {
    if (committed && snapshot && typeof updateUI === 'function') {
      var rawVal = snapshot.val();
      var safeVal = (typeof rawVal === 'number' && isFinite(rawVal) && rawVal >= 0) ? Math.floor(rawVal) : 0;
      updateUI(safeVal);
    }
  });

  window.firebase.database().ref(badgeYearPrefixKey('usage/badges/batches')).transaction(function (current) {
    return safeIncrement(current, 1);
  });
}

window.badgeYearPrefixKey = badgeYearPrefixKey;
window.isBadgeUsageTrackingEnabled = isBadgeUsageTrackingEnabled;
window.readBadgeTotalCount = readBadgeTotalCount;
window.trackBadgeSiteVisit = trackBadgeSiteVisit;
window.trackBadgeFileUpload = trackBadgeFileUpload;
window.trackBadgesGenerated = trackBadgesGenerated;
