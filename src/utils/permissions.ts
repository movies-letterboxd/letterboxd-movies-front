export const availablePermissions = {
  CREATE_MOVIE: "create_movie",
  EDIT_MOVIE: "edit_movie",
  DELETE_MOVIE: "delete_movie"
}

export const hasPermission = (userRoles: string[], permission: string): boolean => {
  return userRoles.includes(permission);
}