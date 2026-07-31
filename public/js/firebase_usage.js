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
    if (typeof updateUI === 'function') updateUI(snapshot.val() || 0);
  }).catch(function () {
    if (typeof updateUI === 'function') updateUI(0);
  });
}

function trackBadgeSiteVisit() {
  if (canWriteBadgeUsage()) {
    window.firebase.database().ref(badgeYearPrefixKey('usage/badges/siteVisits')).transaction(function (count) {
      return (count || 0) + 1;
    });
  }
}

function trackBadgeFileUpload(validCount) {
  if (canWriteBadgeUsage()) {
    window.firebase.database().ref(badgeYearPrefixKey('usage/badges/fileUploads')).transaction(function (count) {
      return (count || 0) + 1;
    });
    window.firebase.database().ref(badgeYearPrefixKey('usage/badges/uploadedRows')).transaction(function (count) {
      return (count || 0) + (validCount || 0);
    });
  }
}

function trackBadgesGenerated(count, updateUI) {
  if (!canWriteBadgeUsage()) return;

  var totalRef = window.firebase.database().ref(badgeYearPrefixKey('usage/badges/totalBadges'));
  totalRef.transaction(function (current) {
    return (current || 0) + (count || 0);
  }, function (error, committed, snapshot) {
    if (committed && snapshot && typeof updateUI === 'function') updateUI(snapshot.val() || 0);
  });

  window.firebase.database().ref(badgeYearPrefixKey('usage/badges/batches')).transaction(function (current) {
    return (current || 0) + 1;
  });
}

window.badgeYearPrefixKey = badgeYearPrefixKey;
window.isBadgeUsageTrackingEnabled = isBadgeUsageTrackingEnabled;
window.readBadgeTotalCount = readBadgeTotalCount;
window.trackBadgeSiteVisit = trackBadgeSiteVisit;
window.trackBadgeFileUpload = trackBadgeFileUpload;
window.trackBadgesGenerated = trackBadgesGenerated;
