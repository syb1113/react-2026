import React from "react";
import { Drawer, DatePicker, Form, Input, Flex, Button } from "antd";

interface DaysDrawerProps {
  open: boolean;
  onClose: () => void;
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

const DaysDrawer: React.FC<DaysDrawerProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();

  return (
    <>
      <Drawer
        title="添加日程安排"
        closable={{ placement: "end" }}
        onClose={onClose}
        open={open}
        maskClosable={false}
        size={600}
        footer={
          <Flex gap="small" wrap justify='flex-end'>
            <Button type="primary">确认</Button>
            <Button onClick={onClose}>取消</Button>
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
            name="Input"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input placeholder="输入安排..." />
          </Form.Item>
          <Form.Item
            label="日期"
            name="rangePicker"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item
            label="备注"
            name="TextArea"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input.TextArea placeholder="输入备注..." />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default DaysDrawer;
