interface Note {
  title: string;
  subtitle: string;
  content: string;
  tags: string[];
}

function isTitleValid(title: string): boolean {
  /*The title is a string of maximum 40 characters*/

  // check if title is a string
  if (typeof title !== "string") return false;

  // check if title is too long
  if (title.length > 40) return false;

  // check if title is not empty
  return title.length > 0;
}

function isSubtitleValid(subtitle: string): boolean {
  // as the subtitle is optional, it is valid if it is undefined
  if (typeof subtitle === "undefined") return true;

  // check if subtitle is a string
  if (typeof subtitle !== "string") return false;

  // check if subtitle is not empty
  return subtitle.length > 0;
}

function isContentValid(content: string): boolean {
  // as the content is optional, it is valid if it is undefined
  if (typeof content === "undefined") return true;

  // check if content is a string
  if (typeof content !== "string") return false;

  // check if content is not empty
  return content.length > 0;
}

function areTagsValid(tags: string[]): boolean {
  // as the content is optional, it is valid if it is undefined
  if (typeof tags === "undefined") return true;

  // check if tags is an array
  if (!Array.isArray(tags)) return false;

  // check if tags is not empty
  return tags.length > 0;
}

function areAllFieldsValid(note: Note): boolean {
  return (
    isTitleValid(note.title) &&
    isSubtitleValid(note.subtitle) &&
    isContentValid(note.content) &&
    areTagsValid(note.tags)
  );
}

function prepareDataToBeSaved(note: Note): Note {
  return {
    title: note.title,

    // if the subtitle is not defined, it will be saved as an empty string
    subtitle: note.subtitle || "",

    // if the content is not defined, it will be saved as an empty string
    content: note.content || "",
    
    // if the tags is not defined, it will be saved as an empty array
    tags: note.tags || []
  };
}

export { isTitleValid, isSubtitleValid, isContentValid, areTagsValid, areAllFieldsValid, prepareDataToBeSaved };