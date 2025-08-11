import React from 'react';

const examples = {
  'E-commerce System': `In an e-commerce system, a Customer can place many Orders. Each Order is placed by only one Customer. An Order contains one or more Products, and a Product can be part of many different Orders. For each product in an order, we store the quantity. Each Product is supplied by a single Supplier, but a Supplier can supply many products. Customers have a PK_customer_id and a name. Orders have a PK_order_id and an order_date. Products have a PK_product_id and a price.`,
  'University Schema': `A student, identified by PK_student_id, can enroll in many courses. A course, with a PK_course_id, can have many students. The enrollment relationship has a grade attribute. A student has a name and MV_hobbies. A professor has a PK_prof_id. A professor advises many students, but each student has only one advisor. A department has many professors. A dependent, a weak entity, is identified by their name and belongs to an employee.`,
  'Simple Social Media': `A User, with a PK_user_id and a username, can create many Posts. Each Post has a PK_post_id and content. A User can also comment on many Posts, and a Post can have many comments. The comment relationship has a timestamp attribute.`
};

export default function Examples({ onSelect, disabled }) {
  return (
    <div style={{ margin: '10px 0' }}>
      <select 
        onChange={(e) => onSelect(e.target.value)} 
        disabled={disabled}
        style={{padding: '5px', fontSize: '14px'}}
      >
        <option value="">Load an example...</option>
        {Object.keys(examples).map(key => (
          <option key={key} value={examples[key]}>{key}</option>
        ))}
      </select>
    </div>
  );
}