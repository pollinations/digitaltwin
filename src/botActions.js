const initialState = { voiceEnabled: true };

export const parseActions = history => {
  console.log("Parsing actions from history...");
  return history.reduce((state, { content }) => {
    let disableIndex = content.lastIndexOf("DESATIVAR_VOZ");
    let enableIndex = content.lastIndexOf("ATIVAR_VOZ");

    // if enable index is 3 ahead of disableIndexit found ATIVAR_VOZ as a substring
    // set the enableIndex to 0
    if (enableIndex - disableIndex === 3)
      enableIndex = -1;

    if (disableIndex !== -1 || enableIndex !== -1) {
      console.log(`Action found - Disable Index: ${disableIndex}, Enable Index: ${enableIndex}`);
    }

  
    if (disableIndex > enableIndex) {
      console.log("Voice disabled based on the latest action.");
      return { ...state, voiceEnabled: false };
    } else if (disableIndex < enableIndex) {
      console.log("Voice enabled based on the latest action.");
      return { ...state, voiceEnabled: true };
    }

    return state; // Removed the "No change in voice state." log to only log meaningful changes or actions found.
  }, initialState);
};
