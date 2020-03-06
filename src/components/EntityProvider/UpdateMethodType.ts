
enum UpdateMethodType {
  /**
   * Use when working with entity that is stored locally. Can be edited.
   */
  LOCAL_UPDATE= 'local',
  /**
   * Use when working with graphql remote entity. Can be edited.
   */
  GRAPHQL_UPDATE = 'graphql',
  /**
   * Use when working with readonly entity (local or remote). Can't be edited.
   */
  READ_ONLY = 'readonly'
}

export default UpdateMethodType
