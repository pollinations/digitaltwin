
const initialState = { voiceEnabled: true };

export const parseActions = history => {
  return history.reduce((state, { content }) => {
    const disableIndex = content.lastIndexOf("DESATIVAR_VOZ");
    const enableIndex = content.lastIndexOf("ATIVAR_VOZ");

    if (disableIndex > enableIndex) {
      return { ...state, voiceEnabled: false };
    } else if (disableIndex < enableIndex) {
      return { ...state, voiceEnabled: true };
    }

    return state;
  }, initialState);
};


