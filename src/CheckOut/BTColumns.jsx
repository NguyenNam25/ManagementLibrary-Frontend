import { Input, Select, Button, Space } from 'antd';
import { SearchOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import React from 'react';

const { Option } = Select;

export default [
    {
        title: "Borrow Ticket ID",
        dataIndex: "ticketId",
        key: "ticketId",
        width: "20%",
    },
    {
        title: "Library Card Number",
        dataIndex: "cardNumber",
        key: "cardNumber",
        width: "20%",
    },
    {
        title: "Details",
        dataIndex: "detail",
        key: "detail",
        width: "10%",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "15%",
        filters: [
            { text: 'Borrowed', value: 'borrowed' },
            { text: 'Returned', value: 'returned' },
            { text: 'Expired', value: 'expired' },
        ],
        onFilter: (value, record) => record.status === value,
        render: (status) => {
            let color = 'blue';
            let text = 'Borrowed';
            
            if (status === 'returned') {
                color = 'green';
                text = 'Returned';
            } else if (status === 'expired') {
                color = 'red';
                text = 'Expired';
            }
            
            return (
                <span style={{ color }}>
                    {text}
                </span>
            );
        }
    },
    {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        width: "20%"
    }
]