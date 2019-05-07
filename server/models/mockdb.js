const db = {
  deliveryOrder: [
    {
      id: 1,
      createdOn: new Date(),
      PlacedBy: "Ajoke Newman",
      parcelName: "Bag",
      weight: "10kg",
      receiverName: "Aloysius",
      receiverPhonenumber: "0806572347",
      destination: "Lagos",
      pickupLocation: "Alaba Intentional",
      descriptioin: "A bag of rice",
      status: "pending",
      updatedAt: ""
    },
    {
      id: 2,
      createdOn: new Date(),
      PlacedBy: "Lious Olade",
      parcelName: "Shoes",
      weight: "100kg",
      receiverName: "Stephaine",
      receiverPhonenumber: "0806567896",
      destination: "Aba",
      pickupLocation: "Ariaria",
      descriptioin: "A pack of an Italian shoe",
      status: "delivered",
      updatedAt: ""
    },
    {
      id: 3,
      createdOn: new Date(),
      PlacedBy: "Nneoma Leonard",
      parcelName: "Mirror",
      weight: "50kg",
      receiverName: "Oge Njoku",
      receiverPhonenumber: "09046787857",
      destination: "Port Harcourt",
      pickupLocation: "Rumokoro",
      descriptioin: "5 bathroom mirrors",
      status: "In-transit",
      updatedAt: new Date()
    },
    {
      id: 4,
      createdOn: new Date(),
      PlacedBy: "Olamide Hassan",
      parcelName: "Cement",
      weight: "500kg",
      receiverName: "Ogadinma",
      receiverPhonenumber: "0706572347",
      destination: "Kano",
      pickupLocation: "Peace Avenue",
      descriptioin: "20 bags of dangote cement",
      status: " pending",
      updatedAt: ""
    },
    {
      id: 5,
      createdOn: new Date(),
      PlacedBy: "Onyinye Emmanuel",
      parcelName: "Clothes",
      weight: "70kg",
      receiverName: "Mayokun",
      receiverPhonenumber: "08065672347",
      destination: "Enugu",
      pickupLocation: "Shoprite Enugu Town",
      descriptioin: "A bail of okirika",
      status: "pending",
      updatedAt: ""
    }
  ]
};

export default db;
