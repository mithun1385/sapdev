const cds = require('@sap/cds')
const { loggers } = require('@sap/cds/lib/log/cds-log')
const { SELECT } = require('@sap/cds/lib/ql/cds-ql')
const logger = cds.log('projects')
const { Books } = cds.entities('bookshop')
const totalStock = 'totalStock'

module.exports = cds.service.impl(function () {


  const changeUrgencyDueToSubject = data => {
    const books = Array.isArray(data) ? data : [data]

    for (let b of books) {
      if (b.title?.toLowerCase().includes("harmless")) {
        b.urgency = "HIGH"
      }

    }
  }
  this.on(totalStock, async () => {
   const result = await SELECT.one.from(Books).columns('sum(stock) as total')

    return result.total  
    
  })
this.after('READ',Books,changeUrgencyDueToSubject)

 this.on('stockValue',Books,async({params:[id]}) =>{
 const result=  await SELECT.columns(['stock * price as stockValue'])
  .from (Books)
  .where`ID = ${id}`
   return result.stockValue
 })
})
 