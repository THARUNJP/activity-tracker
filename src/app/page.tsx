import Image from "next/image";

export default function Home() {
  
  const count = 1;
  return (
  <div className="flex flex-col items-center gap-4">
    <h1 className="text-4xl text-red-500">Timer</h1>
    <h2 className="text-2xl">{count}</h2>
  </div>
  );
}
