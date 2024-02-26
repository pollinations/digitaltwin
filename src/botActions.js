
export const parseActions = history => {
  return history.reduce((state, { content }) => {
    const disableIndex = content.lastIndexOf("DISABLE_VOICE");
    const enableIndex = content.lastIndexOf("ENABLE_VOICE");

    if (disableIndex > enableIndex) {
      return { ...state, voiceEnabled: false };
    } else if (disableIndex < enableIndex) {
      return { ...state, voiceEnabled: true };
    }

    return state;
  }, { voiceEnabled: true });
};


