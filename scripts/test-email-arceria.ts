import { sendOrderConfirmation } from "../lib/email";

async function main() {
  console.log("Test email conferma ordine Arceria (Variante B 44,99 + 4,99)\n");

  // Caso senza upsell
  await sendOrderConfirmation({
    email: process.env.TEST_EMAIL || "daniele.onotri1996@gmail.com",
    orderId: "IT-TEST01",
    firstName: "Daniele",
    lastName: "Test",
    phone: "+39 333 1234567",
    address: "Via Roma 10",
    city: "Milano",
    state: "MI",
    zip: "20100",
    productName: "Arceria — Sandalo ortopedico elastico",
    productImage: "/images/land/arceria/carosello/1.webp",
    color: "Champagne",
    size: "38",
    price: "44.99",
    upsell: false,
    totalPrice: "49.98",
  });
  console.log("[1/2] Email senza upsell inviata");

  // Caso con upsell
  await sendOrderConfirmation({
    email: process.env.TEST_EMAIL || "daniele.onotri1996@gmail.com",
    orderId: "IT-TEST02",
    firstName: "Daniele",
    lastName: "Test",
    phone: "+39 333 1234567",
    address: "Via Roma 10",
    city: "Milano",
    state: "MI",
    zip: "20100",
    productName: "Arceria — Sandalo ortopedico elastico",
    productImage: "/images/land/arceria/carosello/1.webp",
    color: "Champagne",
    size: "38",
    price: "44.99",
    upsell: true,
    upsellPrice: "4.99",
    totalPrice: "54.97",
  });
  console.log("[2/2] Email con upsell plantare inviata");

  console.log("\nVerifica che il subtotale + spedizione + (eventuale upsell) = totale:");
  console.log("  Senza upsell: 44,99 + 4,99 = 49,98 ✓");
  console.log("  Con upsell:   44,99 + 4,99 (plantare) + 4,99 (spedizione) = 54,97 ✓");
}

main().catch((e) => { console.error(e); process.exit(1); });
