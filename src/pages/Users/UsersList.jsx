import React, {useState, useEffect} from "react";
import UserService from "../../services/UserService.js";
import {useQuery} from "react-query";
import {Button, Table, Input, Popconfirm, Switch} from "antd";
import {useTranslation} from "react-i18next";
import cn from "classnames";
import {useLocation} from "react-router-dom";
import AddUser from "../../components/adduser/AddUser.jsx";
import {DRAWER_ACTIONS} from "../../utilities/constants.js";

const DEFAULT_PAGE_SIZE = 10;

const UsersList = () => {
    const location = useLocation();
    location.state = {
        title: "Users"
    };

    const [filters, setFilters] = useState({size: DEFAULT_PAGE_SIZE});
    const [pagination, setPagination] = useState({size: DEFAULT_PAGE_SIZE});
    const [users, setUsers] = useState([]);
    const [selectedUserDetails, setSelectedUserDetails] = useState();
    const [openForm, setOpenForm] = useState(false);
    const {Search} = Input;

    const {data, isLoading: loading, refetch} = useQuery([
        "users", filters
    ], UserService.list);

    useEffect(() => {
        if (data) {
            setUsers(data.data);
            setPagination({
                ...pagination,
                ...data.meta
            });
 
        }

    }, [data]);

    const {t} = useTranslation();

    const closeForm = (action) => {
        if (action !== DRAWER_ACTIONS.CANCEL) {
            refetch().then(() => {
                setSelectedUserDetails(null);
                setOpenForm(false);
            });
        } else {
            setSelectedUserDetails(null);
            setOpenForm(false);
        }
    };

    const editUser = (users) => {
        setSelectedUserDetails(users);
        setOpenForm(DRAWER_ACTIONS.UPDATE);
    };

    const handleDelete = (id) => {
        UserService
            .deleteUser(id)
            .then(() => {
                setUsers(users.filter((user) => user.id !== id));
            });
    };

    const handleTableChange = (pagination, filters, sorter) => {
        const _pagination = {
            ...pagination,
            page: pagination.current,
            size: pagination.pageSize
        };
        const _filters = {
            ...filters,
            isActive: filters.isActive && filters.isActive[0]
        };
        const _sorter = {
            ...sorter,
            direction: sorter.role === "asc" ? "desc" : "asc",
            order:  sorter.direction === "desc" ? "asc" : "desc"
        };
        setPagination(_pagination);
        setFilters({
            ..._filters,
            ..._pagination,
            ..._sorter
        });
    };

    const columns = [
        {
            title: t("common.name"),
            dataIndex: "name",
            key: "name"
        }, {
            title: t("common.email"),
            dataIndex: "email",
            key: "email",
        }, {
            title: t("common.role"),
            dataIndex: "role",
            key: "role",
            sorter: true,
            sortDirections: ['ascend', 'descend', 'ascend'],
            onFilter: (value, record) => record.name.indexOf(value) === 0,
            filterMultiple: false,
            render: (role) => <span checked={role.name}>{role.name}</span>
        }, {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className={cn("")}>
                    <Button onClick={() => editUser(record)}>{t("common.edit")}</Button>

                    <Popconfirm
                        title="Delete"
                        description="Are you sure?"
                        onConfirm={() => handleDelete(record.id)}>
                        <Button>{t("common.delete")}</Button>
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <> < Search onSearch = {
            (e) => setFilters({users: e})
        }
        style = {{ width: 304 }}
        loading = {
            loading
        }
        placeholder = "Search" /> <Button
            type="primary"
            className={cn("mb-3", "mx-1", "float-right")}
            onClick={() => setOpenForm(DRAWER_ACTIONS.CREATE)}>Create</Button>
        <Table
            dataSource={users}
            loading={loading}
            columns={columns}
            rowKey={"id"}
            pagination={{
                defaultPageSize: DEFAULT_PAGE_SIZE,
                current: pagination.currentPage,
                total: pagination.totalItems,
                showSizeChanger: true
            }}
            scroll={{
                y: 420
            }}
            onChange={handleTableChange}/>
        <AddUser details={selectedUserDetails} openType={openForm} onClose={closeForm}/>
    </>
    );
};

export default UsersList;
