import React from "react";
import { Drawer, DatePicker, Form, Input, Flex, Button } from "antd";

interface DaysDrawerProps {
  open: boolean;
  onClose: () => void;
  dateId: string;
}

const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const DaysDrawer: React.FC<DaysDrawerProps> = ({ open, onClose, dateId }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    console.log("提交表单",dateId);
    form.validateFields().then(() => {
      console.log(form.getFieldsValue());
    });
  };
  
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      <Drawer
        title="添加日程安排"
        closable={{ placement: "end" }}
        onClose={handleCancel}
        open={open}
        maskClosable={false}
        size={600}
        footer={
          <Flex gap="small" wrap justify='flex-end'>
            <Button type="primary" onClick={handleSubmit}>确认</Button>
            <Button onClick={handleCancel}>取消</Button>
          </Flex>
        }
      >
        <Form
          {...formItemLayout}
          form={form}
          variant="outlined"
          initialValues={{ variant: "filled" }}
        >
          <Form.Item
            label="安排"
            name="name"
            rules={[{ required: true, message: "请输入安排" }]}
          >
            <Input placeholder="输入安排..." />
          </Form.Item>
          <Form.Item
            label="日期"
            name="date"
            rules={[{ required: true, message: "请选择日期" }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remarks"
          >
            <Input.TextArea placeholder="输入备注..." />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default DaysDrawer;
