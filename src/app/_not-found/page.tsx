import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-gray-600">Sorry, this page does not exist.</p>
      <p className="mt-2 text-gray-600">Sorry, this page does not exist.</p>
      <Link href="/dashboard" className="text-blue-600 underline mt-4 inline-block">Go Home</Link>
    </div>
  );
}
