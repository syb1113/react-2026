import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";

// 定义数据项的类型接口（从 TransferPage 中抽出，供组件复用）
export interface TransferItem {
  id: number;
  value: string;
  label: string;
  time: string;
}

const CheckboxGroup = Checkbox.Group;

type Props = {
  /** 外层容器 className（用于 left/right 等差异） */
  className?: string;
  /** 头部标题 */
  title: string;
  /** 列表数据 */
  items: TransferItem[];
  /** 当前勾选值 */
  checkedValues: string[];
  /** 列表勾选变化 */
  onChange: (checkedValues: string[]) => void;
  /** 全选 checkbox 状态 */
  checkAll: boolean;
  /** 半选状态 */
  indeterminate: boolean;
  /** 全选 checkbox 变化 */
  onCheckAllChange: CheckboxProps["onChange"];
  /** item 文本 className */
  itemLabelClassName?: string;
};

export default function TransferListPanel({
  className,
  title,
  items,
  checkedValues,
  onChange,
  checkAll,
  indeterminate,
  onCheckAllChange,
  itemLabelClassName,
}: Props) {
  return (
    <div
      className={[
        "flex-1 border border-gray-200 rounded-md flex flex-col overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between p-2.5! sticky top-0 bg-white z-10 border-b border-gray-200">
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          <span className="text-xl">
            {title} ({items.length})
          </span>
        </Checkbox>
      </div>

      <CheckboxGroup
        className="overflow-y-auto"
        value={checkedValues}
        onChange={onChange}
      >
        {items.map((item) => (
          <div
            key={item.value}
            className="px-2.5! py-1! w-full flex justify-between"
          >
            <Checkbox value={item.value}>
              <div
                className={["text-xl truncate", itemLabelClassName]
                  .filter(Boolean)
                  .join(" ")}
                style={{ width: "320px" }}
              >
                {item.label}
              </div>
            </Checkbox>
            <span className="text-sm text-gray-500">{item.time}</span>
          </div>
        ))}
      </CheckboxGroup>
    </div>
  );
}


