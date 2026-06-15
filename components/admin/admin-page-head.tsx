type AdminPageHeadProps = {
  title: string;
  description: string;
  updatedAt?: string;
  action?: React.ReactNode;
};

export function AdminPageHead({ title, description, updatedAt, action }: AdminPageHeadProps) {
  return (
    <div className="adm-page-head">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 className="adm-page-title">{title}</h1>
          <p className="adm-page-desc">{description}</p>
          {updatedAt && (
            <p className="adm-updated">Last synced {new Date(updatedAt).toLocaleString()}</p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
