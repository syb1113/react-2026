import { Select } from "antd";

function Header() {
  return (
    <div>
      <Select
        defaultValue="lucy"
        style={{ width: 120 }}
        options={[
          { value: "jack", label: "Jack" },
          { value: "lucy", label: "Lucy" },
          { value: "Yiminghe", label: "yiminghe" },
        ]}
      />
      <Select
        defaultValue="lucy"
        style={{ width: 120 }}
        options={[
          { value: "jack", label: "Jack" },
          { value: "lucy", label: "Lucy" },
          { value: "Yiminghe", label: "yiminghe" },
        ]}
      />
    </div>
  );
}

export default Header;
