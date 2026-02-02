import React, { useEffect } from "react";
import { Drawer, DatePicker, Form, Input, Flex, Button } from "antd";
import { useCallback } from "react";
import { Dayjs } from "dayjs";

interface DaysDrawerProps {
  open: boolean;
  onClose: (val?: FormValues) => void;
  dateId: string;
  minDate?: Dayjs | null; // 最小可选日期
}

interface FormValues {
  id: string;
  name: string;
  date: Dayjs[];
  remarks: string;
}

const { RangePicker } = DatePicker;

// 将静态配置移到组件外部，避免每次渲染都重新创建
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

const DaysDrawer: React.FC<DaysDrawerProps> = ({
  open,
  onClose,
  dateId,
  minDate,
}) => {
  const [form] = Form.useForm();

  // 当弹窗打开时，设置默认日期
  useEffect(() => {
    if (open && minDate) {
      // 设置默认的日期范围为选中的日期
      form.setFieldsValue({
        date: [minDate, minDate],
      });
    }
  }, [open, minDate, form]);

  // 禁用早于 minDate 的日期
  const disabledDate = (current: Dayjs) => {
    if (!minDate) return false;
    // 禁用早于 minDate 的日期
    return current && current < minDate.startOf("day");
  };

  // 使用 useCallback 缓存 handleSubmit 函数
  const handleSubmit = useCallback(() => {
    console.log("提交表单", dateId);
    form.validateFields().then(() => {
      const fieldsValue = form.getFieldsValue();
      const data = {
        id: dateId,
        ...fieldsValue,
      };
      onClose(data);
      form.resetFields();
    });
  }, [dateId, onClose, form]);

  // 使用 useCallback 缓存 handleCancel 函数
  const handleCancel = useCallback(() => {
    form.resetFields();
    onClose();
  }, [onClose, form]);

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
          <Flex gap="small" wrap="wrap" justify="flex-end">
            <Button type="primary" onClick={handleSubmit}>
              确认
            </Button>
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
            <RangePicker disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item label="备注" name="remarks">
            <Input.TextArea placeholder="输入备注..." />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default DaysDrawer;
