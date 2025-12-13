function Card({
  id,
  typecard,
  img,
  name,
  location,
  price,
  discount,
  beforeprice,
  expire,
  classimg = "",
  classwcard = "",
  classtitle = "",
  classdescription = "",
  classprice = "",
  classtextsmall = ""
}) {
  let cardtype;

  if (typecard === "vertical") {
    // --- Vertical Card ---
    cardtype = (
      <div className="p-1 pb-2 min-w-55" key={id}>
        <img
          src={img}
          alt={name || "Card image"}
          className={`w-screen h-screen pb-2 mb-1 border-b border-b-amber-600/30 ${classimg}`}
        />

        <div className="px-1.5">
          <p className="text-lg h-17">{name}</p>
          <p className="text-sm">{location}</p>

          <div className="pt-0">
            <span className="text-2xl">${price}</span>
            <span className="uppercase px-2 text-sm">{discount}</span>
          </div>

          <p className="line-through text-gray-500 text-sm">
            Antes <span>{beforeprice}</span>
          </p>
        </div>
      </div>
    );
  } 
  
  else if (typecard === "horizontal") {
    // --- Horizontal Card ---
    cardtype = (
      <div
        className={`px-1 py-4 flex border-b border-gray-500/30 ${classwcard}`}
        key={id}
      >
        <div className="w-40">
          <img 
            src={img}
            alt={name || "Card image"}
            className="w-screen max-h-40"
          />
        </div>

        <div className="px-1.5">
          <p className={`h-5 mb-3 ${classtitle}`}>{name}</p>
          <p className={`font-light ${classdescription}`}>{location}</p>

          <div className="pt-1">
            <span className={`${classprice}`}>${price}</span>
            <span className={`px-1 uppercase ${classtextsmall}`}>{discount}</span>
          </div>

          <p className={`line-through text-gray-500 ${classtextsmall}`}>
            Antes <span>{beforeprice}</span>
          </p>

          {expire && (
            <p className="text-medium-small">Válido hasta {expire}</p>
          )}
        </div>
      </div>
    );
  }

  return <>{cardtype}</>;
}

export default Card;
