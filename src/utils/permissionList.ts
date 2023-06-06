export const permissions = [
	'user_create',
	'user_view',
	'user_list',
	'user_update',
	'user_delete',
	'role_create',
	'role_view',
	'role_list',
	'role_update',
	'role_delete',
	'company_create',
	'company_view',
	'company_list',
	'company_update',
	'company_delete',
]
// const permissionList = permissions.reduce((acc, permission) => {
// 	acc[permission] = permission
// 	return acc
// }, {} as Record<string, string>)