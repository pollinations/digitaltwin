

export const parseActions = history => {
  const state = { voiceEnabled: true };

  history.forEach(({ content }) => {
    if (content.includes("DISABLE_VOICE")) state.voiceEnabled = false;
    else if (content.includes("ENABLE_VOICE")) state.voiceEnabled = true;
  });

  return state;
};
