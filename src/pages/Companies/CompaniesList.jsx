import React, {useEffect, useState} from "react";
import CompaniesService from "../../services/CompaniesService.js";
import {useQuery} from "react-query";
import {Button, Table, Modal, Input, Popconfirm} from "antd";
import {useTranslation} from "react-i18next";
import cn from "classnames";
import {useLocation} from "react-router-dom";
import CompanyForm from "../../components/createcompany/CreateCompany";
import {DRAWER_ACTIONS} from "../../utilities/constants.js";

//ToDo: add pagination
//ToDo: add filters

const CompaniesList = () => {
    const location = useLocation();
    location.state = {
        title: "Companies"
    };

    const [filters, setFilters] = useState();
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyDetails, setSelectedCompanyDetails] = useState();
    const [openForm, setOpenForm] = useState(false);
    const {Search} = Input;

    const {data, isLoading: loading, refetch} = useQuery([
        "companies", filters
    ], CompaniesService.companyList);

    useEffect(() => {
        if (data) {
            setCompanies(data.data);
        }

    }, [data]);

    const {t} = useTranslation();

    const handleDelete = (id) => {
        CompaniesService
            .deleteCompany(id)
            .then(() => {
                setCompanies(companies.filter((company) => company.id !== id));
            });
    };

    const onChange = async (e) => {
        setFilters(e.searchData);
        var searchData = companies.filter((item) => {
            if (item.name.toString().toLowerCase().includes(e.target.value.toLowerCase())) {
                return item;
            } else {
                return setFilters({}) && setCompanies({});
            }
        });
        setCompanies(searchData);
    };

    const closeForm = (action) => {
        if (action !== DRAWER_ACTIONS.CANCEL) {
            refetch().then(() => {
                setSelectedCompanyDetails(null);
                setOpenForm(false);
            });
        } else {
            setSelectedCompanyDetails(null);
            setOpenForm(false);
        }
    };

    const editCompany = (company) => {
        setSelectedCompanyDetails(company);
        setOpenForm(DRAWER_ACTIONS.UPDATE);
    };

    const columns = [
        {
            title: t("common.name"),
            dataIndex: "name",
            key: "name",
            onFilter: (value, record) => record
                .name
                .indexOf(value) === 0,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend']
        }, {
            title: t("common.description"),
            dataIndex: "description",
            key: "description",
            onFilter: (value, record) => record
                .name
                .indexOf(value) === 0,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: [t("common.descend")]
        }, {
            title: t("common.active"),
            dataIndex: "isActive",
            key: "isActive",
            onFilter: (value, record) => record
                .name
                .indexOf(value) === 0,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: [t("common.descend")],
            render: (company) => <span>{
                        company.isActive
                            ? "Yes"
                            : "No"
                    }</span>
        }, {
            title: t("common.actions"),
            key: "actions",
            onFilter: (value, record) => record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
            render: (_, record) => (
                <div className={cn("")}>
                    <Button onClick={() => editCompany(record)}>{t("common.edit")}</Button>

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
        <> < Search onChange={ (e) =>
    onChange(e) } style =
    {{ width: 304 }}
    />
      <Button
        type="primary"
        className={cn("mb-3", "mx-1", "float-right")}
        onClick={() => setOpenForm(DRAWER_ACTIONS.CREATE)}
      >
        Create
      </Button > <Table
            dataSource={companies}
            loading={loading}
            columns={columns}
            pagination={{
                pageSize: 10
            }}
            rowKey={"id"}/>
        <CompanyForm
            details={selectedCompanyDetails}
            openType={openForm}
            onClose={closeForm}/>
    </>
    );
};

export default CompaniesList;


