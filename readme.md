### Directory System Conventions
- **Folders**: kebab-case (my-project, code, data, docs, test)
- **Files**: snake_case (main_app.js, my_database_file.db, notes.md)  
**Example**:
```
/my-project
├── /code
│   ├── customer_service.js
│   ├── main_app.js
│   └── order_processor.js
├── /data
│   └── my_database_file.db
├── /docs
│   └── notes.md
└── /test
    └── unit_tests.js
```

### Code System Conventions
- **Variables**: snake_case (target_customer_id)
- **Functions**: camelCase (openDatabase)
- **Constants/Enums/Classes**: PascalCase (DbFile)
- **Interfaces/Structs/Types**: Pascal_Snake_Case (Item_Props)  
**Example**:
```javascript
//code/main_app.js

const SQLite = require('sqlite');
const SQLite3 = require('sqlite3');

//constant variables use PascalCase
const DbFile = './data/my_database_file.db';

//classes use PascalCase
class CustomerService {
  constructor() {
    this.db = null;
  }

  //functions use camelCase
  async openDatabase() {
    this.db = await SQLite.open({
      filename: DbFile,
      driver: SQLite3.Database,
    });
  }

  //functions use camelCase
  async getCustomerOrders(customer_id) {
    //non-constant variables use snake_case
    let sql_query = ` --see data system conventions
      select Order_Id, Order_Date, Total_Amount
      from MyStore.TblOrder
      where Customer_Id = ?
    `;

    //non-constant variables use snake_case
    let customer_orders = await this.db.all(sql_query, customer_id);

    customer_orders.forEach(order => {
      //non-constant variables (within a loop) use snake_case
      let {order_id, order_date, total_amount} = order;
      console.log(`Order ID: ${order_id}, Date: ${order_date}, Total: ${total_amount}`);
    });
  }

  //functions use camelCase
  async closeDatabase() {
    await this.db.close();
  }
}

//usage example
async function runExample() {
  let customer_service = new CustomerService();
  await customer_service.openDatabase();

  //non-constant variables use snake_case
  let target_customer_id = 1;

  await customer_service.getCustomerOrders(target_customer_id);
  await customer_service.closeDatabase();
}

runExample();
```

### Data System Conventions
- **Schemas/Tables/Views**: PascalCase (Dbo.MyStore, MyStore.TblOrder, MyStore.VwOrder)
- **Columns**: Pascal_Snake_Case (Order_Id, Customer_Id, First_Name)
- **Stored Procedures/Functions**: camelCase (spLoadOrders, getProperCase, fnCalculateOrder)
- **Variables/Aliases**: snake_case (order_id, order_month, cte_mod)  
**Example**:
```sql
create view Dbo.MyStore.VwOrder as
with cte as (
	select
		o.Order_Id as order_id
		,o.Order_Date as order_date
		,iif(o.Total_Amount is null, 0, o.Total_Amount) as total_amount
	from
		MyStore.TblOrder as o
		/*
		--left join MyStore.TblCustomer as c
			--on c.Customer_Id = o.Customer_Id
		*/
	where
		o.Customer_Id = 1
		and o.Customer_Type = 'Business'
)
,cte_mod as (
	select
		order_id
		,order_date
		,datePart(Month, order_date) as order_month
		,total_amount
	from
		cte
)
select * from cte_mod
```
