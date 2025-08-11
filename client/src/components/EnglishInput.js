import React from "react";

export default function EnglishInput({ value, onChange, onSubmit, loading }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading) onSubmit(value);
      }}
    >
      <textarea
        rows={8}
        style={{ width: "100%", fontSize: 16, boxSizing: 'border-box' }}
        disabled={loading}
        value={value}
        placeholder="Describe your ER diagram in plain English..."
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" disabled={loading || !value.trim()} style={{ marginTop: 8, padding: '8px 12px', fontSize: '14px' }}>
        {loading ? "Generating..." : "Generate ER Diagram"}
      </button>
    </form>
  );
}
