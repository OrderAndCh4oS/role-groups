
interface IRoleGroupManager {
  permissionsGroups: IRoleGroup[];
  addRoleGroup: (permissionsGroup: IRoleGroup) => void;
  removeRoleGroup: (permissionsGroup: IRoleGroup) => void;
}

interface IUsersManager {
  users: IUser[];
  addUser: (user: IUser) => void;
  removeUser: (user: IUser) => void;
}

interface IRoleManager {
  roles: IRole[];
  addRole: (permissionScheme: IRole) => void;
  removeRole: (permissionScheme: IRole) => void;
}

interface IPermissionsManager {
  permissions: string[];
  addPermission: (permission: string) => void;
  removePermission: (permission: string) => void;
}

interface IRoleGroup extends IUsersManager, IRoleManager {
  uuid: string;
  name: string;
}

interface IUser {
  uuid: string;
  name: string;
}

interface IList extends IRoleGroupManager {
  uuid: string;
  name: string;
  hasPermission: (user: IUser, permission: string) => boolean;
}

interface IBoard extends IRoleGroupManager {
  uuid: string;
  name: string;
  hasPermission: (user: IUser, permission: string) => boolean;
}

interface IRole extends IPermissionsManager {
  uuid: string;
  name: string;
}

const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  const r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});


const addRoleGroup = (permissionsGroups: IRoleGroup[]) => (permissionsGroup: IRoleGroup) => {
  permissionsGroups.push(permissionsGroup);
};

const removeRoleGroup = (permissionsGroups: IRoleGroup[]) => (permissionsGroup: IRoleGroup) => {
  permissionsGroups = permissionsGroups.filter(pg => pg.uuid !== permissionsGroup.uuid);
  const l = permissionsGroups.length;
  let i = 0;
  for(; i < l; i++) {
    if(permissionsGroups[i].uuid === permissionsGroup.uuid) {
      permissionsGroups.splice(i, 1);
      break;
    }
  }
};

const addUser = (users: IUser[]) => (user: IUser) => {
  users.push(user);
};

const removeUser = (users: IUser[]) => (user: IUser) => {
  const l = users.length;
  let i = 0;
  for(; i < l; i++) {
    if(users[i].uuid === user.uuid) {
      users.splice(i, 1);
      break;
    }
  }
};

const addRole = (roles: IRole[]) => (permissionScheme: IRole) => {
  roles.push(permissionScheme);
};

const removeRole = (roles: IRole[]) => (permissionScheme: IRole) => {
  const l = roles.length;
  let i = 0;
  for(; i < l; i++) {
    if(roles[i].uuid === permissionScheme.uuid) {
      roles.splice(i, 1);
      break;
    }
  }
};

const hasPermission = (permissionsGroups: IRoleGroup[]) => (user: IUser, action: string): boolean => {
  for (let permissionGroup of permissionsGroups) {
    for (let permissionGroupUser of permissionGroup.users) {
      if (permissionGroupUser.uuid === user.uuid) {
        for (let permissionScheme of permissionGroup.roles) {
          if (permissionScheme.permissions.find((a: string) => a === action)) return true;
        }
      }
    }
  }
  return false;
};

const makeBoard = (name: string): IBoard => {
  const permissionsGroups: IRoleGroup[] = [];

  return ({
    uuid: uuidv4(),
    name,
    permissionsGroups,
    addRoleGroup: addRoleGroup(permissionsGroups),
    removeRoleGroup: removeRoleGroup(permissionsGroups),
    hasPermission: hasPermission(permissionsGroups)
  });
};

const makeList = (name: string): IList => {
  const permissionsGroups: IRoleGroup[] = [];

  return ({
    uuid: uuidv4(),
    name,
    permissionsGroups,
    addRoleGroup: addRoleGroup(permissionsGroups),
    removeRoleGroup: removeRoleGroup(permissionsGroups),
    hasPermission: hasPermission(permissionsGroups)
  });
};

const makeRoleGroup = (name: string) => {
  const roles: IRole[] = [];
  const users: IUser[] = [];

  return ({
    uuid: uuidv4(),
    name,
    users,
    roles,
    addRole: addRole(roles),
    removeRole: removeRole(roles),
    addUser: addUser(users),
    removeUser: removeUser(users),
  });
};

const makeUser = (name: string) => ({
  uuid: uuidv4(),
  name
});

const makeRole = (name: string): IRole => {
  const permissions: string[] = [];
  return ({
    uuid: uuidv4(),
    name,
    permissions,
    addPermission: (permission: string) => {
      permissions.push(permission)
    },
    removePermission: (permission: string) => {
      const l = permissions.length;
      let i = 0;
      for(; i < l; i++) {
        if(permissions[i] === permission) {
          permissions.splice(i, 1);
          break;
        }
      }
    }
  });
};

const boardOne = makeBoard('boardOne');
const listOne = makeList('listOne');
const adminRoleGroup = makeRoleGroup('admin');
const listEditorRoleGroup = makeRoleGroup('list-editor');
const cardEditorRoleGroup = makeRoleGroup('card-editor');
const cardMoverRoleGroup = makeRoleGroup('card-mover');
const userA = makeUser('Jason: Admin');
const userB = makeUser('Janet: List Editor');
const userC = makeUser('June: Card Editor');
const userD = makeUser('Jebediah: Card Mover');

const allBoardRole = makeRole('allBoardPermissions');
allBoardRole.addPermission('createLists');
allBoardRole.addPermission('archiveLists');
allBoardRole.addPermission('moveLists');

const allListRole = makeRole('allListPermissions');
allListRole.addPermission('archiveList');
allListRole.addPermission('moveList');

const allCardRole = makeRole('allCardPermissions');
allCardRole.addPermission('createCard');
allCardRole.addPermission('editCard');
allCardRole.addPermission('moveCardTo');
allCardRole.addPermission('moveCardFrom');
allCardRole.addPermission('archiveCard');

const moveCardRole = makeRole('moveCardPermissions');
moveCardRole.addPermission('moveCardTo');
moveCardRole.addPermission('moveCardFrom');

adminRoleGroup.addUser(userA);
adminRoleGroup.addRole(allBoardRole);
adminRoleGroup.addRole(allListRole);
adminRoleGroup.addRole(allCardRole);

boardOne.addRoleGroup(adminRoleGroup);
listOne.addRoleGroup(adminRoleGroup);

listEditorRoleGroup.addUser(userB);
listEditorRoleGroup.addRole(allListRole);

listOne.addRoleGroup(listEditorRoleGroup);

cardEditorRoleGroup.addUser(userC);
cardEditorRoleGroup.addRole(allCardRole);

listOne.addRoleGroup(cardEditorRoleGroup);

cardMoverRoleGroup.addUser(userD);
cardMoverRoleGroup.addRole(moveCardRole);

listOne.addRoleGroup(cardMoverRoleGroup);

console.log('~~Begin~~');

console.log(`${userA.name} should have permission to createLists on boardOne: `, boardOne.hasPermission(userA, 'createLists'));
console.log(`${userB.name} should not have permission to createLists on boardOne: `, boardOne.hasPermission(userB, 'createLists'));

console.log(`${userA.name} should have permission to archiveLists on boardOne: `, boardOne.hasPermission(userA, 'archiveLists'));
console.log(`${userB.name} should not have permission to archiveLists on boardOne: `, boardOne.hasPermission(userB, 'archiveLists'));

console.log(`${userA.name} should have permission to moveLists on boardOne: `, boardOne.hasPermission(userA, 'moveLists'));
console.log(`${userB.name} should not have permission to moveLists on boardOne: `, boardOne.hasPermission(userB, 'moveLists'));

console.log(`${userA.name} should have permission to moveList for listOne: `, listOne.hasPermission(userA, 'moveList'));
console.log(`${userB.name} should have permission to moveList for listOne: `, listOne.hasPermission(userB, 'moveList'));
console.log(`${userC.name} should not have permission to moveList for listOne: `, listOne.hasPermission(userC, 'moveList'));

console.log(`${userA.name} should have permission to archiveList for listOne: `, listOne.hasPermission(userA, 'archiveList'));
console.log(`${userB.name} should have permission to archiveList for listOne: `, listOne.hasPermission(userB, 'archiveList'));
console.log(`${userC.name} should not have permission to archiveList for listOne: `, listOne.hasPermission(userC, 'archiveList'));

console.log(`${userA.name} should have permission to createCard on listOne: `, listOne.hasPermission(userA, 'createCard'));
console.log(`${userB.name} should not have permission to createCard on listOne: `, listOne.hasPermission(userB, 'createCard'));
console.log(`${userC.name} should have permission to createCard on listOne: `, listOne.hasPermission(userC, 'createCard'));
console.log(`${userD.name} should not have permission to createCard on listOne: `, listOne.hasPermission(userD, 'createCard'));

console.log(`${userA.name} should have permission to editCard on listOne: `, listOne.hasPermission(userA, 'editCard'));
console.log(`${userB.name} should not have permission to editCard on listOne: `, listOne.hasPermission(userB, 'editCard'));
console.log(`${userC.name} should have permission to editCard on listOne: `, listOne.hasPermission(userC, 'editCard'));
console.log(`${userD.name} should not have permission to editCard on listOne: `, listOne.hasPermission(userD, 'editCard'));

console.log(`${userA.name} should have permission to archiveCard on listOne: `, listOne.hasPermission(userA, 'archiveCard'));
console.log(`${userB.name} should not have permission to archiveCard on listOne: `, listOne.hasPermission(userB, 'archiveCard'));
console.log(`${userC.name} should have permission to archiveCard on listOne: `, listOne.hasPermission(userC, 'archiveCard'));
console.log(`${userD.name} should not have permission to archiveCard on listOne: `, listOne.hasPermission(userD, 'archiveCard'));

console.log(`${userA.name} should have permission to moveCardTo on listOne: `, listOne.hasPermission(userA, 'moveCardTo'));
console.log(`${userB.name} should not have permission to moveCardTo on listOne: `, listOne.hasPermission(userB, 'moveCardTo'));
console.log(`${userC.name} should have permission to moveCardTo on listOne: `, listOne.hasPermission(userC, 'moveCardTo'));
console.log(`${userD.name} should have permission to moveCardTo on listOne: `, listOne.hasPermission(userD, 'moveCardTo'));

console.log(`${userA.name} should have permission to moveCardFrom on listOne: `, listOne.hasPermission(userA, 'moveCardFrom'));
console.log(`${userB.name} should not have permission to moveCardFrom on listOne: `, listOne.hasPermission(userB, 'moveCardFrom'));
console.log(`${userC.name} should have permission to moveCardFrom on listOne: `, listOne.hasPermission(userC, 'moveCardFrom'));
console.log(`${userD.name} should have permission to moveCardFrom on listOne: `, listOne.hasPermission(userD, 'moveCardFrom'));

console.log('~~Fin~~');
