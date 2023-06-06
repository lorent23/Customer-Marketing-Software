import React, { useEffect } from "react";
import {Button, Drawer, Form, Input, Space, Select} from "antd";
// import {useLocation, useNavigate} from "react-router-dom";
import UserService from "../../services/UserService.js";
import {
    useCreateUser,
    useUpdateUser,
  } from "../../services/UserService.js";
import CompanyService from "../../services/CompaniesService.js";
import {useQuery} from "react-query";
import {useTranslation} from "react-i18next";
import {DRAWER_ACTIONS} from "../../utilities/constants.js";

const AddUser = ({details, openType, onClose: closeModal}) => {
    const { mutate: createUser } = useCreateUser();
    const { mutate: updateUser } = useUpdateUser();
    const [form] = Form.useForm();
    // const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/";

    const {
        data: {
            data: roles
        }
    } = useQuery(["roles"], UserService.roles);

    const {
        data: {
            data: companies
        }
    } = useQuery(["companies"], CompanyService.companyList);

    const {t} = useTranslation();
    

    const onClose = (action = DRAWER_ACTIONS.CANCEL) => {
        form.resetFields();
        closeModal(action);
    };

    const onFinish = (values) => {
        if (openType === DRAWER_ACTIONS.CREATE) {
            createUser(values, {
                onSuccess: () => {
                    onClose(DRAWER_ACTIONS.CREATE);
                }
            });
        } else {
            updateUser({
                ...values,
                id: details.id
            }, {
                onSuccess: () => {
                    onClose(DRAWER_ACTIONS.UPDATE);
                }
            });
        }
    };

    useEffect(() => {
        form.setFieldsValue(details);
      }, [details]);
    
      const onSubmit = () => {
        form.submit();
      };

    return (
        <Drawer
            title={openType === DRAWER_ACTIONS.CREATE
                ? "Create User"
                : "Edit User"
}
            onClose={onClose}
            open={openType}
            width={400}
            bodyStyle={{
                paddingBottom: 80
            }}
            extra={
            <Space > 
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onSubmit} type="primary">
                Submit
            </Button>
           </Space>}>
            <Form
                form={form}
                name="basic"
                labelCol={{
                    span: 8
                }}
                wrapperCol={{
                    span: 16
                }}
                initialValues={{
                    remember: true
                }}
                onFinish={onFinish}
                autoComplete="off">
                <Form.Item
                    label={t("common.name")}
                    name="name"
                    rules={[{
                            required: true,
                            message: "Please input name!"
                        }
                    ]}>
                    <Input/>
                </Form.Item>

                <Form.Item
                    label={t("common.surname")}
                    name="surname"
                    rules={[{
                            required: true,
                            message: "Please input surname!"
                        }
                    ]}>
                    <Input/>
                </Form.Item>

                <Form.Item
                    label={t("common.email")}
                    name="email"
                    rules={[{
                            required: true,
                            message: "Please input email!"
                        }
                    ]}>
                    <Input/>
                </Form.Item>

                <Form.Item
                    label={t("common.role")}
                    name="roleId"
                    type="number"
                    rules={[{
                            required: true
                        }
                    ]}>
                    <Select name="roleId" id="roleId">
                        {
                            roles && roles.map((role) => (
                                <options key={role.id} value={role.id}>
                                    {role.name}
                                </options>
                            ))
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    label={t("common.company")}
                    name="companyId"
                    rules={[{
                            required: true
                        }
                    ]}>
                    <Select name="companyId" id="companyId">
                        {
                            companies && companies.map((company) => (
                                <options key={company.id} value={company.id}>
                                    {company.name}
                                </options>
                            ))
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    label={t("common.password")}
                    name="password"
                    rules={[{
                            required: true,
                            message: "Please input your password!"
                        }
                    ]}>
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16
                    }}>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default AddUser;

