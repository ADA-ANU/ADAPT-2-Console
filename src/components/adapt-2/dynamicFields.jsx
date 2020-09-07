import React from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Divider, Button, Select, Input, Row, Col } from "antd";
import 'antd/es/spin/style/css';

function DynamicField(props) {
    const formItemLayout = {
        labelCol: {
            span: 4, offset: 2
        },
        wrapperCol: {
            span: 16, offset: 1
        },
    };
    const formItemSubLayout = {
        labelCol: {
            span: 4, offset: 0
        },
        wrapperCol: {
            span: 18, offset: 1
        },
    };
    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            span: 12, offset: 4
        },
    };
    const presetVales=(cb)=>{
        props.values.map(ele=>{
            cb(ele)
        })
    }
    console.log(props.required)
    console.log(props.values)
    return (
        <Form.List name="authorFields">
            {(fields, { add, remove }) => {
                return (
                    <div style={{display: 'inline'}}>
                        {fields.map((field, index) => {
                            console.log(field)
                            console.log(index)
                            return (
                                // <Form.Item
                                // {...(formItemLayout)}
                                // label={`Author ${index+2}`}
                                // rules={[
                                //     {
                                //         required: props.required,
                                //
                                //     },
                                // ]}
                                // key={field.key}
                                // >
                                <div key={field.key}>
                                    <Form.Item
                                        {...(formItemLayout)}
                                        //name={[index, "firstName"]}
                                        label={`Author ${index+2}'s First Name`}
                                        //required={props.required}
                                        //key={`${index}firstName`}
                                        // rules={[
                                        //     {
                                        //         required: props.required,
                                        //         message: `Please input name of author ${index + 2}.`,
                                        //     },
                                        // ]}

                                    >
                                        <Form.Item
                                            {...(formItemLayout)}
                                            name={[index, "firstName"]}
                                            //label={`Author ${index+2}'s First Name`}
                                            required={props.required}
                                            //key={`${index}firstName`}
                                            rules={[
                                                {
                                                    required: props.required,
                                                    message: `Please input name of author ${index + 2}.`,
                                                },
                                            ]}
                                            noStyle
                                        >
                                        <Input
                                            disabled={!props.required}
                                            placeholder={`Input name of author ${index + 2}`}
                                            style={{width: '90%', marginRight: 8}}
                                        />
                                        </Form.Item>
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                    remove(field.name);
                                                }}
                                            />

                                    </Form.Item>
                                    <Form.Item
                                        {...(formItemLayout)}
                                        name={[index, "lastName"]}
                                        required={props.required}
                                        label={`Author ${index+2}'s Last Name`}
                                        //key={`${index}lastName`}
                                        rules={[
                                            {
                                                required: props.required,
                                                message: `Please input name of author ${index + 2}.`,
                                            },
                                        ]}
                                    >
                                        <Input
                                            disabled={!props.required}
                                            placeholder={`Input name of author ${index + 2}`}
                                            style={{width: '90%', marginRight: 8}}
                                        />
                                    </Form.Item>
                                </div>
                                    )})}
                                    {/*<Divider />*/}
                                    <Row gutter={16}>
                                        <Col className="gutter-row" span={5}/>
                                        <Col className="gutter-row" span={18}>
                                            <Form.Item

                                                style={{textAlign: 'center'}}
                                                //label={'d'}
                                            >
                                                <Button
                                                    type="dashed"
                                                    onClick={() => add()}
                                                    style={{width: "40%", marginLeft: '20%'}}
                                                    disabled={!props.required}
                                                >
                                                    <PlusOutlined/> Add Author
                                                </Button>
                                            </Form.Item>
                                        </Col>

                                    </Row>
                    </div>
                )
            }}
        </Form.List>
    );
}

export default DynamicField;
