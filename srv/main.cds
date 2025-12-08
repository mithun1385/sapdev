using org from '../db/schema';
extend org.qmarco.Books with {
    virtual urgency : String;
}
service bookshop {
    entity Books   as projection on org.qmarco.Books
        actions {
            function stockValue() returns Integer;
            action   setPrice(price: Integer)
        };

    entity Authors as projection on org.qmarco.Authors;
    entity Orders  as projection on org.qmarco.Orders;

    function totalStock() returns Integer

}
