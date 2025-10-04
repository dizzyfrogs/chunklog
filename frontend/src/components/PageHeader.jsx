import '../styles/PageHeader.css';

function PageHeader({ title, children }) {
  return (
    <div className="page-header">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

export default PageHeader;