import AuthForm from "@/components/auth/authForm";

export default function AuthPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <AuthForm />
    </div>
  );
}
