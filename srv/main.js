const cds = require('@sap/cds')
const { SELECT, UPDATE } = require('@sap/cds/lib/ql/cds-ql')
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
  this.after('READ', Books, changeUrgencyDueToSubject)
  this.on('stockValue', Books, async (req) => {

    const { ID } = req.params[0];

    const result = await SELECT.one
      .columns`stock * price as stockValue`
      .from(Books)
      .where({ ID });
     

    return { value: result?.stockValue ?? null };
  });
  this.on('setPrice',Books,async req =>{
    const id = req.params[0]
    logger(req.data)
    await UPDATE (Books, id).with({
      price:req.data.params
    })

    return await SELECT(Books,id)
  })

})
