export const COMANDS = {
  START: "start",
  COMMANDS: "commands",
  NEW: "new",
  GOPNIC: "gopnik",
  SNOB: "snob",
  PROFESSOR: "professor",
  VOICE: "voice",
  CREATE_IMAGE: "create_image",

  IMAGE_COMMANDS: "image_commands",
  VARIATON: "variaton_image",
  EDIT_IMAGE: "edit_image",
};

export const MODE = {
  CHAT: "chat",
  VOICE_TO_TEXT: "voice to text",
  CREATE_IMAGE: "create_image",
};

export const IMAGE_MODE = {
  VARIATON: "variation",
  EDIT_BY_PROMPT: "edit by prompt",
};

export const INITIAL_SESSION = {
  messages: [],
  mode: MODE.CHAT,
  image_mode: IMAGE_MODE.VARIATON,
  pngPath: null,
};
