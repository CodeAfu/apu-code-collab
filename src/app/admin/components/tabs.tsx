import TabButton from "./tab-button";

export default function Tabs() {
  return (
    <div className="flex flex-col">
      <TabButton href="/admin">Dashboard</TabButton>
      <TabButton href="/admin/users">Users</TabButton>
      <TabButton href="/admin/courses">Courses</TabButton>
      <TabButton href="/admin/programming-languages">Programming Languages</TabButton>
      <TabButton href="/admin/frameworks">Framworks</TabButton>
    </div>
  );
}
