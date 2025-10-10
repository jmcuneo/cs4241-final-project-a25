// utils/mapFormToVector.js

const courseMap = {
    cs1101: 0,
    cs2102: 1,
    cs3733: 2,
  };
  
  const personalityMap = {
    introverted: 0,
    extroverted: 1,
  };
  
  const priorityMap = {
    highest_priority: 0,
    just_pass: 1,
  };
  
  const assignmentMap = {
    exam: 0,
    project: 1,
    hw: 2,
  };
  
  const communicationStyleMap = {
    yap: 0,
    lock_in: 1,
  };
  
  const noiseLevelMap = {
    silent: 0,
    bgm: 1,
    chatter: 2,
  };

  const timeOfDayMap = {
    morning: 0,
    afternoon: 1,
    night: 2,
  };
  
  const studyPaceMap = {
    fast: 0,
    steady: 1,
    slow: 2,
  };
  
  const breakStyleMap = {
    short: 0,
    long: 1,
    none: 2,
  };
  
  // Helper to map value to index or -1 if missing
  function mapValue(map, value) {
    if (value === undefined || value === null || value === "") return -1;
    return value in map ? map[value] : -1;
  }

  // Robust boolean normalizer -> 1 / 0 / -1
  function mapBoolean(value) {
    // Accept real booleans, strings "true"/"false", numbers 1/0, or undefined
    if (value === true || value === "true" || value === 1 || value === "1") return 1;
    if (value === false || value === "false" || value === 0 || value === "0") return 0;
    return -1;
  }
  
  export function formDataToVector(formData = {}) {
    return [
      mapValue(courseMap, formData.course),
      mapValue(personalityMap, formData.personality),
      mapValue(priorityMap, formData.priority),
      mapValue(assignmentMap, formData.assignment),
      mapValue(communicationStyleMap, formData.communicationStyle),
      mapValue(noiseLevelMap, formData.noiseLevel),
      // Location boolean mapping (isOnline)
      mapBoolean(formData.isOnline),
      mapValue(timeOfDayMap, formData.timeOfDay),
      mapValue(studyPaceMap, formData.studyPace),
      mapValue(breakStyleMap, formData.breakStyle),
    ];
  }
  