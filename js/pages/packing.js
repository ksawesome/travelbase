// ============================================================
// TravelBase — Packing List Page
// All 143+ items from Packing List.md embedded here
// ============================================================

import Store from '../store.js';
import Timer from '../timer.js';
import Auth from '../auth.js';

const DEFAULT_PACKING = {
  bags: [
    {
      id: 'cabin', name: 'Cabin Bag', maxWeight: 7000,
      categories: [
        { id: 'documents', name: 'Documents (physical)', emoji: '📄', items: [
          { id:'c1', name:'Passport (valid beyond Aug 2026)', quantity:1, estimatedWeight:50, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c2', name:'DS-2019 original', quantity:1, estimatedWeight:10, packed:false, skipped:false, notes:'THE most important doc — never check this', deadline:null },
          { id:'c3', name:'SEVIS fee payment receipt (I-901)', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'Printed copy', deadline:null },
          { id:'c4', name:'J-1 visa stamp page photocopy', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'Keep separate from original', deadline:null },
          { id:'c5', name:'Offer/appointment letter — WiRES Lab', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c6', name:'NOC from IITGN (original + 2 copies)', quantity:3, estimatedWeight:15, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c7', name:'IITGN bonafide certificate / student ID', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c8', name:'10th & 12th marksheets + certificates', quantity:1, estimatedWeight:20, packed:false, skipped:false, notes:'Useful for US bureaucracy', deadline:null },
          { id:'c9', name:'IITGN admission/enrollment proof', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c10', name:'Travel insurance policy (printed)', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c11', name:'UB housing confirmation', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'Printed or contact info', deadline:null },
          { id:'c12', name:'Flight itinerary printout', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c13', name:'Emergency contacts sheet', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'Advisor, family, Indian consulate (+1-212-774-0600)', deadline:null },
          { id:'c14', name:'Passport-size photos (2×2 in, white bg)', quantity:10, estimatedWeight:20, packed:false, skipped:false, notes:'US spec. For ID cards, library cards, lab badges', deadline:null },
          { id:'c15', name:'PAN card', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'For Indian tax/bank matters', deadline:null },
          { id:'c16', name:'International debit/credit cards', quantity:2, estimatedWeight:10, packed:false, skipped:false, notes:'Visa + Mastercard (Niyo/HDFC Forex)', deadline:null },
          { id:'c17', name:'USD cash ($150-200 mixed)', quantity:1, estimatedWeight:10, packed:false, skipped:false, notes:'For first 48 hours', deadline:null },
        ]},
        { id: 'electronics_cabin', name: 'Electronics (carry-on)', emoji: '💻', items: [
          { id:'c18', name:'Laptop + charger', quantity:1, estimatedWeight:1800, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c19', name:'Laptop sleeve (padded)', quantity:1, estimatedWeight:200, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c20', name:'Noise-cancelling earphones/earbuds', quantity:1, estimatedWeight:50, packed:false, skipped:false, notes:'Flight + lab focus', deadline:null },
          { id:'c21', name:'Power bank (≤100Wh, 20000mAh)', quantity:1, estimatedWeight:350, packed:false, skipped:false, notes:'Must be in cabin', deadline:null },
          { id:'c22', name:'USB-C cable × 2', quantity:2, estimatedWeight:40, packed:false, skipped:false, notes:'Phone + backup', deadline:null },
          { id:'c23', name:'Phone + phone charger', quantity:1, estimatedWeight:250, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c24', name:'Universal travel adapter (Type B)', quantity:1, estimatedWeight:100, packed:false, skipped:false, notes:'For immediate use on arrival', deadline:null },
          { id:'c25', name:'Pen drive (32/64 GB) encrypted backup', quantity:1, estimatedWeight:10, packed:false, skipped:false, notes:'All documents backed up', deadline:null },
        ]},
        { id: 'comfort', name: 'Comfort for Flight', emoji: '😴', items: [
          { id:'c26', name:'Neck pillow (inflatable)', quantity:1, estimatedWeight:100, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c27', name:'Eye mask', quantity:1, estimatedWeight:20, packed:false, skipped:false, notes:'', deadline:null },
          { id:'c28', name:'Earplugs', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'Backup to earphones', deadline:null },
          { id:'c29', name:'Compression socks', quantity:1, estimatedWeight:60, packed:false, skipped:false, notes:'Reduces DVT risk on 14+ hr flights', deadline:null },
          { id:'c30', name:'Toiletry zip-lock (sanitizer, lip balm, moisturizer)', quantity:1, estimatedWeight:100, packed:false, skipped:false, notes:'All ≤100ml', deadline:null },
          { id:'c31', name:'Change of clothes in vacuum roll', quantity:1, estimatedWeight:200, packed:false, skipped:false, notes:'Tee, underwear, socks — in case bags lost', deadline:null },
          { id:'c32', name:'Flight snacks', quantity:1, estimatedWeight:200, packed:false, skipped:false, notes:'Dry chana, energy bars, dates', deadline:null },
        ]},
        { id: 'meds_cabin', name: 'Medications (cabin)', emoji: '💊', items: [
          { id:'c33', name:'Prescription medications (8-week supply)', quantity:1, estimatedWeight:50, packed:false, skipped:false, notes:'Full supply in cabin, never check', deadline:null },
          { id:'c34', name:'Prescription copy from doctor', quantity:1, estimatedWeight:5, packed:false, skipped:false, notes:'English language', deadline:null },
        ]},
      ]
    },
    {
      id: 'checked1', name: 'Checked Bag 1', maxWeight: 23000,
      categories: [
        { id: 'tops', name: 'Tops', emoji: '👔', items: [
          { id:'b1_1', name:'Plain cotton t-shirts (neutral/dark)', quantity:8, estimatedWeight:1200, packed:false, skipped:false, notes:'Daily lab wear', deadline:null },
          { id:'b1_2', name:'Collar shirts / half-sleeve formals', quantity:4, estimatedWeight:800, packed:false, skipped:false, notes:'Presentations, seminars, PI meetings', deadline:null },
          { id:'b1_3', name:'Full-sleeve light cotton shirts', quantity:2, estimatedWeight:300, packed:false, skipped:false, notes:'Cold indoor days', deadline:null },
          { id:'b1_4', name:'Sweatshirt / light hoodie', quantity:2, estimatedWeight:700, packed:false, skipped:false, notes:'Essential for AC', deadline:null },
          { id:'b1_5', name:'Thermal undershirt (light)', quantity:1, estimatedWeight:150, packed:false, skipped:false, notes:'Cold evenings in August', deadline:null },
        ]},
        { id: 'bottoms', name: 'Bottoms', emoji: '👖', items: [
          { id:'b1_6', name:'Jeans (dark wash)', quantity:2, estimatedWeight:1200, packed:false, skipped:false, notes:'Versatile', deadline:null },
          { id:'b1_7', name:'Chinos / smart casual trousers', quantity:2, estimatedWeight:800, packed:false, skipped:false, notes:'Lab presentations, formal meetings', deadline:null },
          { id:'b1_8', name:'Athletic/track pants', quantity:2, estimatedWeight:500, packed:false, skipped:false, notes:'Evenings, gym, casual', deadline:null },
          { id:'b1_9', name:'Cargo shorts / casual shorts', quantity:2, estimatedWeight:400, packed:false, skipped:false, notes:'Outdoor weekends', deadline:null },
          { id:'b1_10', name:'Formal trouser (dark navy/charcoal)', quantity:1, estimatedWeight:400, packed:false, skipped:false, notes:'Poster sessions, conferences', deadline:null },
        ]},
        { id: 'innerwear', name: 'Innerwear & Socks', emoji: '🩲', items: [
          { id:'b1_11', name:'Underwear (quick-dry)', quantity:14, estimatedWeight:500, packed:false, skipped:false, notes:'2 weeks worth', deadline:null },
          { id:'b1_12', name:'Socks (ankle, cotton)', quantity:10, estimatedWeight:300, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b1_13', name:'Socks (athletic/no-show)', quantity:4, estimatedWeight:100, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b1_14', name:'Thermal base-layer bottom (light)', quantity:1, estimatedWeight:150, packed:false, skipped:false, notes:'Late-night outdoor evenings', deadline:null },
        ]},
        { id: 'sleepwear', name: 'Sleepwear', emoji: '🛏️', items: [
          { id:'b1_15', name:'Pyjama bottoms', quantity:2, estimatedWeight:400, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b1_16', name:'Old light tees (sleep)', quantity:2, estimatedWeight:200, packed:false, skipped:false, notes:'Repurpose worn-out tees', deadline:null },
        ]},
        { id: 'shoes', name: 'Shoes & Footwear', emoji: '👟', items: [
          { id:'b1_17', name:'Everyday walking sneakers (broken in)', quantity:1, estimatedWeight:700, packed:false, skipped:false, notes:'Lots of campus walking', deadline:null },
          { id:'b1_18', name:'Formal / smart casual shoes', quantity:1, estimatedWeight:600, packed:false, skipped:false, notes:'Presentations, networking', deadline:null },
          { id:'b1_19', name:'Athletic/running shoes', quantity:1, estimatedWeight:600, packed:false, skipped:false, notes:'Gym + weekend runs', deadline:null },
          { id:'b1_20', name:'Flip-flops / slippers', quantity:1, estimatedWeight:200, packed:false, skipped:false, notes:'Dorm bathroom, indoor use', deadline:null },
          { id:'b1_21x', name:'New shoes (arriving June 2)', quantity:1, estimatedWeight:700, packed:false, skipped:false, notes:'Shoes arrive by June 2 — pack as soon as they arrive', deadline:'2026-06-02T23:59:00+05:30' },
        ]},
        { id: 'rain', name: 'Rain Gear', emoji: '🌧️', items: [
          { id:'b1_21', name:'Compact travel umbrella', quantity:1, estimatedWeight:300, packed:false, skipped:false, notes:'Buffalo afternoon thunderstorms', deadline:null },
          { id:'b1_22', name:'Lightweight rain jacket / windbreaker', quantity:1, estimatedWeight:250, packed:false, skipped:false, notes:'Doubles as cold evening layer', deadline:null },
        ]},
        { id: 'accessories', name: 'Accessories', emoji: '🎒', items: [
          { id:'b1_23', name:'Belt (casual + formal)', quantity:2, estimatedWeight:200, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b1_24', name:'Watch', quantity:1, estimatedWeight:60, packed:false, skipped:false, notes:'Daily wear', deadline:null },
          { id:'b1_25', name:'Sunglasses (UV400)', quantity:1, estimatedWeight:40, packed:false, skipped:false, notes:'July UV index 7-8', deadline:null },
          { id:'b1_26', name:'Baseball cap', quantity:1, estimatedWeight:80, packed:false, skipped:false, notes:'Sun protection', deadline:null },
          { id:'b1_27', name:'Lightweight scarf / muffler', quantity:1, estimatedWeight:60, packed:false, skipped:false, notes:'Cool evenings, AC', deadline:null },
        ]},
        { id: 'laundry', name: 'Laundry Supplies', emoji: '🧺', items: [
          { id:'b1_28', name:'Travel detergent pods/sachets', quantity:4, estimatedWeight:100, packed:false, skipped:false, notes:'4 hand-wash cycles for first week', deadline:null },
          { id:'b1_29', name:'Mesh laundry bag', quantity:1, estimatedWeight:50, packed:false, skipped:false, notes:'For dorm machines', deadline:null },
          { id:'b1_30', name:'Laundry quarters/card budget', quantity:1, estimatedWeight:0, packed:false, skipped:false, notes:'$15-20/month', deadline:null },
        ]},
      ]
    },
    {
      id: 'checked2', name: 'Checked Bag 2', maxWeight: 23000,
      categories: [
        { id: 'toiletries', name: 'Toiletries', emoji: '🧴', items: [
          { id:'b2_1', name:'Shampoo (400ml)', quantity:1, estimatedWeight:450, packed:false, skipped:false, notes:'Indian brand, cheaper', deadline:null },
          { id:'b2_2', name:'Conditioner (200ml)', quantity:1, estimatedWeight:220, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_3', name:'Body wash (200-250ml)', quantity:2, estimatedWeight:500, packed:false, skipped:false, notes:'8 weeks supply', deadline:null },
          { id:'b2_4', name:'Face wash (150ml)', quantity:1, estimatedWeight:170, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_5', name:'Moisturizing cream/lotion (150ml)', quantity:1, estimatedWeight:170, packed:false, skipped:false, notes:'US AC dries skin', deadline:null },
          { id:'b2_6', name:'Sunscreen SPF 50+', quantity:2, estimatedWeight:220, packed:false, skipped:false, notes:'Outdoor summer essential', deadline:null },
          { id:'b2_7', name:'Lip balm with SPF', quantity:2, estimatedWeight:20, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_8', name:'Toothbrush + backup', quantity:2, estimatedWeight:30, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_9', name:'Toothpaste', quantity:2, estimatedWeight:200, packed:false, skipped:false, notes:'Preferred brand', deadline:null },
          { id:'b2_10', name:'Tongue cleaner', quantity:1, estimatedWeight:10, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_11', name:'Dental floss', quantity:2, estimatedWeight:20, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_12', name:'Mouthwash (travel-size)', quantity:1, estimatedWeight:100, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_13', name:'Razor / electric trimmer + cable', quantity:1, estimatedWeight:200, packed:false, skipped:false, notes:'Electric preferred for 8 weeks', deadline:null },
          { id:'b2_14', name:'Shaving gel/foam', quantity:1, estimatedWeight:150, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_15', name:'Deodorant / antiperspirant', quantity:2, estimatedWeight:200, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_16', name:'Cologne (≤50ml)', quantity:1, estimatedWeight:80, packed:false, skipped:false, notes:'Checked only', deadline:null },
          { id:'b2_17', name:'Nail clippers + file', quantity:1, estimatedWeight:30, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_18', name:'Cotton buds', quantity:1, estimatedWeight:30, packed:false, skipped:false, notes:'100 count', deadline:null },
          { id:'b2_19', name:'Hair comb / brush', quantity:1, estimatedWeight:30, packed:false, skipped:false, notes:'', deadline:null },
        ]},
        { id: 'firstaid', name: 'First Aid & Medications', emoji: '🩹', items: [
          { id:'b2_20', name:'Paracetamol / Crocin', quantity:20, estimatedWeight:20, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_21', name:'Ibuprofen / Brufen', quantity:20, estimatedWeight:20, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_22', name:'Antacid / Digene', quantity:1, estimatedWeight:30, packed:false, skipped:false, notes:'Diet change week 1', deadline:null },
          { id:'b2_23', name:'ORS sachets', quantity:8, estimatedWeight:40, packed:false, skipped:false, notes:'Heat + travel dehydration', deadline:null },
          { id:'b2_24', name:'Anti-diarrheal (Loperamide)', quantity:1, estimatedWeight:10, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_25', name:'Antihistamine (Cetrizine)', quantity:1, estimatedWeight:10, packed:false, skipped:false, notes:'Buffalo pollen June-Jul', deadline:null },
          { id:'b2_26', name:'Multivitamin (60-count)', quantity:1, estimatedWeight:80, packed:false, skipped:false, notes:'8 weeks', deadline:null },
          { id:'b2_27', name:'Vitamin D3 (60-count)', quantity:1, estimatedWeight:60, packed:false, skipped:false, notes:'Indoor research life', deadline:null },
          { id:'b2_28', name:'Melatonin 3mg', quantity:10, estimatedWeight:10, packed:false, skipped:false, notes:'Jet lag recovery', deadline:null },
          { id:'b2_29', name:'Band-aids / adhesive bandages', quantity:1, estimatedWeight:30, packed:false, skipped:false, notes:'Assorted sizes', deadline:null },
          { id:'b2_30', name:'Antiseptic cream', quantity:1, estimatedWeight:20, packed:false, skipped:false, notes:'Betadine/Soframycin', deadline:null },
          { id:'b2_31', name:'Digital thermometer', quantity:1, estimatedWeight:20, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_32', name:'Cold & cough tablet', quantity:1, estimatedWeight:10, packed:false, skipped:false, notes:'Sinarest or equiv', deadline:null },
        ]},
        { id: 'food', name: 'Indian Food Supplies', emoji: '🍛', items: [
          { id:'b2_33', name:'Instant rice pouches (MTR)', quantity:8, estimatedWeight:1600, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_34', name:'Instant upma mix', quantity:4, estimatedWeight:400, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_35', name:'Instant poha mix', quantity:4, estimatedWeight:400, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_36', name:'Masala oats', quantity:6, estimatedWeight:420, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_37', name:'Ready-to-eat pouches (dal/rajma)', quantity:10, estimatedWeight:2000, packed:false, skipped:false, notes:'Late lab night lifesavers', deadline:null },
          { id:'b2_38', name:'Khichdi mix', quantity:4, estimatedWeight:400, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_39', name:'Maggi / Yippee noodles', quantity:20, estimatedWeight:1400, packed:false, skipped:false, notes:'Pack flat. Microwave-safe mug', deadline:null },
          { id:'b2_40', name:'Masala mixes (pulao, etc.)', quantity:2, estimatedWeight:60, packed:false, skipped:false, notes:'Everest/MDH', deadline:null },
          { id:'b2_41', name:'Spice zip-locks (jeera, turmeric, chili, dhania-jeera, garam masala)', quantity:5, estimatedWeight:200, packed:false, skipped:false, notes:'~30-50g each', deadline:null },
          { id:'b2_42', name:'Ghee (sealed tin, 200g)', quantity:1, estimatedWeight:220, packed:false, skipped:false, notes:'Makes plain rice edible', deadline:null },
          { id:'b2_43', name:'Chutney powder (peanut/coconut)', quantity:2, estimatedWeight:100, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_44', name:'Snack stash (chakli, chivda, bhujia, etc.)', quantity:1, estimatedWeight:500, packed:false, skipped:false, notes:'~500g total', deadline:null },
          { id:'b2_45', name:'Tea bags (50-count)', quantity:1, estimatedWeight:120, packed:false, skipped:false, notes:'US tea is weak', deadline:null },
          { id:'b2_46', name:'Hing (asafoetida)', quantity:1, estimatedWeight:20, packed:false, skipped:false, notes:'Big flavor, tiny weight', deadline:null },
        ]},
        { id: 'electronics_checked', name: 'Electronics & Tech', emoji: '🔌', items: [
          { id:'b2_47', name:'Travel adapter (Type B) #2', quantity:1, estimatedWeight:100, packed:false, skipped:false, notes:'Second adapter', deadline:null },
          { id:'b2_48', name:'HDMI cable', quantity:1, estimatedWeight:60, packed:false, skipped:false, notes:'Lab monitors, presentations', deadline:null },
          { id:'b2_49', name:'Wireless mouse', quantity:1, estimatedWeight:80, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_50', name:'Mouse pad (thin, foldable)', quantity:1, estimatedWeight:40, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_51', name:'Wired earphones (backup)', quantity:1, estimatedWeight:20, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_52', name:'Cable organizer / velcro ties', quantity:1, estimatedWeight:30, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_53', name:'External SSD/HDD (1TB)', quantity:1, estimatedWeight:100, packed:false, skipped:false, notes:'Backup research data locally', deadline:null },
          { id:'b2_54', name:'USB-C to USB-A hub (4-port)', quantity:1, estimatedWeight:50, packed:false, skipped:false, notes:'Lab peripherals', deadline:null },
        ]},
        { id: 'academic', name: 'Academic & Office', emoji: '📓', items: [
          { id:'b2_55', name:'Notebook (A5/A4, ruled)', quantity:2, estimatedWeight:300, packed:false, skipped:false, notes:'Lab meetings, ideation', deadline:null },
          { id:'b2_56', name:'Pens (ballpoint, black)', quantity:5, estimatedWeight:30, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_57', name:'Highlighters', quantity:2, estimatedWeight:20, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_58', name:'Sticky notes', quantity:1, estimatedWeight:30, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_59', name:'Document sleeves/folders', quantity:2, estimatedWeight:40, packed:false, skipped:false, notes:'For meeting printouts', deadline:null },
        ]},
        { id: 'household', name: 'Miscellaneous Household', emoji: '🏠', items: [
          { id:'b2_60', name:'Foldable clothes hangers', quantity:5, estimatedWeight:100, packed:false, skipped:false, notes:'Dorms have few', deadline:null },
          { id:'b2_61', name:'TSA-approved padlocks', quantity:2, estimatedWeight:100, packed:false, skipped:false, notes:'Bags + dorm storage', deadline:null },
          { id:'b2_62', name:'Zip-lock bags (assorted)', quantity:12, estimatedWeight:50, packed:false, skipped:false, notes:'Snacks, docs, spills', deadline:null },
          { id:'b2_63', name:'Small scissors', quantity:1, estimatedWeight:30, packed:false, skipped:false, notes:'Checked only', deadline:null },
          { id:'b2_64', name:'Sewing kit (mini)', quantity:1, estimatedWeight:30, packed:false, skipped:false, notes:'Needle, thread, safety pins', deadline:null },
          { id:'b2_65', name:'Shoe bags (fabric)', quantity:2, estimatedWeight:30, packed:false, skipped:false, notes:'', deadline:null },
          { id:'b2_66', name:'Clothesline (retractable)', quantity:1, estimatedWeight:40, packed:false, skipped:false, notes:'Hand-wash drying', deadline:null },
          { id:'b2_67', name:'Reusable water bottle (1L, insulated)', quantity:1, estimatedWeight:300, packed:false, skipped:false, notes:'Tap water drinkable in Buffalo', deadline:null },
          { id:'b2_68', name:'Travel mug (350ml, insulated)', quantity:1, estimatedWeight:200, packed:false, skipped:false, notes:'Dorm to lab coffee/tea', deadline:null },
          { id:'b2_69', name:'Cutlery set (spoon, fork, knife)', quantity:1, estimatedWeight:80, packed:false, skipped:false, notes:'Shared kitchens run out', deadline:null },
          { id:'b2_70', name:'Microwave-safe bowl with lid', quantity:1, estimatedWeight:150, packed:false, skipped:false, notes:'Maggi, MTR reheating', deadline:null },
          { id:'b2_71', name:'Reusable grocery bags', quantity:2, estimatedWeight:40, packed:false, skipped:false, notes:'Stores charge for bags', deadline:null },
          { id:'b2_72', name:'Duct tape (travel roll)', quantity:1, estimatedWeight:30, packed:false, skipped:false, notes:'Fixes everything', deadline:null },
          { id:'b2_73', name:'Small flashlight', quantity:1, estimatedWeight:60, packed:false, skipped:false, notes:'Campus walks at night', deadline:null },
        ]},
      ]
    }
  ],
  shopping: {
    india: [
      { id:'s1', name:'10 passport-size photos (2×2 in, white bg)', bought:false, notes:'Get at studio, specify US visa size', deadline:null },
      { id:'s2', name:'Photocopy set of all documents (2 full sets)', bought:false, notes:'Laminate key ones', deadline:null },
      { id:'s3', name:'USD Forex card loaded $800-1000', bought:false, notes:'Niyo Global, HDFC, or SBI Forex', deadline:null },
      { id:'s4', name:'Print DS-2019, visa, insurance, housing docs', bought:false, notes:'', deadline:null },
      { id:'s5', name:'Rain jacket', bought:false, notes:'If you don\'t own one', deadline:null },
      { id:'s6', name:'Packing cubes (4-6 cubes)', bought:false, notes:'Decathlon India, affordable', deadline:null },
      { id:'s7', name:'TSA padlocks × 2', bought:false, notes:'Amazon India ₹300-500 each', deadline:null },
      { id:'s8', name:'Travel adapters (Type B)', bought:false, notes:'₹200-300 Amazon India', deadline:null },
      { id:'s9', name:'Vacuum compression bags × 2', bought:false, notes:'Saves 30-40% volume', deadline:null },
      { id:'s10', name:'MTR/Haldirams/Maggi food stash', bought:false, notes:'D-Mart or BigBasket. ₹2000-3000 total', deadline:null },
    ],
    buffalo: [
      { id:'sb1', name:'Rice (5 lb bag)', bought:false, price:'$4-5', notes:'Walmart', deadline:null },
      { id:'sb2', name:'Bread, peanut butter, jam', bought:false, price:'~$8', notes:'First-week survival', deadline:null },
      { id:'sb3', name:'Eggs (dozen)', bought:false, price:'$4-5', notes:'', deadline:null },
      { id:'sb4', name:'Milk (gallon)', bought:false, price:'$3-4', notes:'', deadline:null },
      { id:'sb5', name:'Power strip / extension cord (6ft)', bought:false, price:'$12-15', notes:'Day 1 purchase!', deadline:null },
      { id:'sb6', name:'T-Mobile prepaid SIM', bought:false, price:'$30/month', notes:'Best on Buffalo campus', deadline:null },
      { id:'sb7', name:'Tide Pods (30-count)', bought:false, price:'$12', notes:'Laundry', deadline:null },
      { id:'sb8', name:'Shower caddy', bought:false, price:'$8-12', notes:'Shared bathroom', deadline:null },
      { id:'sb9', name:'Twin XL bedsheets', bought:false, price:'$20-30', notes:'Confirm if dorm provides', deadline:null },
      { id:'sb10', name:'Blanket / throw', bought:false, price:'$15-20', notes:'Summer AC can be extreme', deadline:null },
      { id:'sb11', name:'Small desk lamp', bought:false, price:'$10-15', notes:'Dorm lighting inadequate', deadline:null },
      { id:'sb12', name:'Allergy tablets (Zyrtec/Claritin)', bought:false, price:'$15-20', notes:'If Buffalo pollen hits hard', deadline:null },
    ]
  }
};

const Packing = (() => {
  function render(container) {
    let data = Store.load('packing', null);
    if (!data) {
      data = JSON.parse(JSON.stringify(DEFAULT_PACKING));
      Store.save('packing', data);
    }

    const canEdit = Auth.canEdit();

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><span class="emoji">📦</span> Packing List</h1>
          <p class="page-subtitle">Track every item across your 3 bags</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-sm btn-ghost" id="btn-print" title="Print packing list">🖨️ Print</button>
          ${canEdit ? '<button class="btn btn-sm btn-secondary" id="btn-reset">↻ Reset All</button>' : ''}
        </div>
      </div>

      <div class="tabs mb-6" id="packing-tabs">
        <button class="tab active" data-tab="cabin">✈️ Cabin Bag (7 kg)</button>
        <button class="tab" data-tab="checked1">🧳 Checked Bag 1 (23 kg)</button>
        <button class="tab" data-tab="checked2">🧳 Checked Bag 2 (23 kg)</button>
        <button class="tab" data-tab="shopping_india">🇮🇳 Buy in India</button>
        <button class="tab" data-tab="shopping_buffalo">🇺🇸 Buy in Buffalo</button>
      </div>

      <div class="packing-header" id="bag-stats"></div>

      <div class="flex gap-4 mb-4">
        <div class="search-box">
          <span class="search-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <input type="text" class="input" id="packing-search" placeholder="Search items...">
        </div>
        <div class="filter-pills" id="filter-pills">
          <button class="filter-pill active" data-filter="all">All</button>
          <button class="filter-pill" data-filter="packed">Packed ✓</button>
          <button class="filter-pill" data-filter="pending">Pending</button>
          <button class="filter-pill" data-filter="skipped">Skipped</button>
        </div>
      </div>

      <div id="packing-content"></div>
    `;

    let activeTab = 'cabin';
    let activeFilter = 'all';
    let searchQuery = '';

    function renderTab() {
      const content = document.getElementById('packing-content');
      const statsEl = document.getElementById('bag-stats');

      if (activeTab.startsWith('shopping')) {
        renderShopping(content, activeTab === 'shopping_india' ? 'india' : 'buffalo');
        statsEl.innerHTML = '';
        return;
      }

      const bag = data.bags.find(b => b.id === activeTab);
      if (!bag) return;

      // Stats
      let totalItems = 0, packedItems = 0, totalWeight = 0;
      bag.categories.forEach(cat => {
        cat.items.forEach(item => {
          if (!item.skipped) {
            totalItems++;
            if (item.packed) {
              packedItems++;
              totalWeight += (item.estimatedWeight || 0) * (item.quantity || 1);
            }
          }
        });
      });

      const pct = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
      const weightKg = (totalWeight / 1000).toFixed(1);
      const maxKg = (bag.maxWeight / 1000).toFixed(0);
      const weightPct = Math.min(100, (totalWeight / bag.maxWeight) * 100);
      const weightColor = weightPct > 95 ? '#ef4444' : weightPct > 85 ? '#f59e0b' : '#10b981';

      statsEl.innerHTML = `
        <div class="flex items-center gap-6">
          <div><span class="stat-value text-xl">${packedItems}/${totalItems}</span><span class="stat-label ml-2">items packed</span></div>
          <div class="progress-bar" style="width:200px"><div class="progress-fill ${pct >= 66 ? 'green' : pct >= 33 ? 'amber' : 'red'}" style="width:${pct}%"></div></div>
          <span class="font-mono text-sm text-accent">${pct}%</span>
        </div>
        <div class="flex items-center gap-4" style="margin-left:auto">
          <span class="text-sm">⚖️ ${weightKg} / ${maxKg} kg</span>
          <div class="progress-bar" style="width:120px"><div class="progress-fill" style="width:${weightPct}%;background:${weightColor}"></div></div>
        </div>
      `;

      // Categories
      content.innerHTML = bag.categories.map(cat => {
        const catItems = filterItems(cat.items);
        const catPacked = cat.items.filter(i => i.packed && !i.skipped).length;
        const catTotal = cat.items.filter(i => !i.skipped).length;

        return `
          <div class="accordion open" data-cat="${cat.id}">
            <button class="accordion-header">
              <span>${cat.emoji} ${cat.name}</span>
              <span class="badge badge-${catPacked === catTotal ? 'success' : 'muted'}" style="margin-left:auto;margin-right:8px">${catPacked}/${catTotal}</span>
              <span class="accordion-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></span>
            </button>
            <div class="accordion-body">
              <div class="accordion-content packing-list">
                ${catItems.length === 0 ? '<div class="text-sm text-muted p-4">No matching items</div>' : ''}
                ${catItems.map(item => renderItem(item, bag.id, cat.id)).join('')}
                ${canEdit ? `<button class="btn btn-sm btn-ghost w-full mt-2" data-add-item="${cat.id}" data-bag="${bag.id}">+ Add item</button>` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');

      attachItemHandlers(bag.id);
    }

    function filterItems(items) {
      return items.filter(item => {
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (activeFilter === 'packed') return item.packed && !item.skipped;
        if (activeFilter === 'pending') return !item.packed && !item.skipped;
        if (activeFilter === 'skipped') return item.skipped;
        return true;
      });
    }

    function renderItem(item, bagId, catId) {
      const deadlineBadge = item.deadline ? Timer.renderDeadlineBadge(item.deadline, item.packed, item.packed ? Date.now() : null) : '';
      return `
        <div class="packing-item ${item.packed ? 'packed' : ''} ${item.skipped ? 'skipped' : ''}" data-item-id="${item.id}">
          <input type="checkbox" class="checkbox" ${item.packed ? 'checked' : ''} ${item.skipped ? 'disabled' : ''} data-check="${item.id}">
          <span class="packing-item-name">${item.name}</span>
          <div class="packing-item-meta">
            ${item.quantity > 1 ? `<span class="qty-badge">×${item.quantity}</span>` : ''}
            ${deadlineBadge}
            ${item.notes ? `<span class="tag text-xs" title="${item.notes}">📝</span>` : ''}
            ${canEdit ? `<button class="btn-icon" data-skip="${item.id}" title="${item.skipped ? 'Unskip' : 'Skip'}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>` : ''}
          </div>
        </div>`;
    }

    function renderShopping(el, type) {
      const list = data.shopping[type];
      const boughtCount = list.filter(i => i.bought).length;
      el.innerHTML = `
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-muted">${boughtCount}/${list.length} purchased</span>
          </div>
          <div class="packing-list">
            ${list.map(item => `
              <div class="packing-item ${item.bought ? 'packed' : ''}" data-shop-id="${item.id}">
                <input type="checkbox" class="checkbox" ${item.bought ? 'checked' : ''} data-shop-check="${item.id}">
                <span class="packing-item-name">${item.name}</span>
                <div class="packing-item-meta">
                  ${item.price ? `<span class="badge badge-info">${item.price}</span>` : ''}
                  ${item.notes ? `<span class="text-xs text-muted">${item.notes}</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Shopping checkboxes
      el.querySelectorAll('[data-shop-check]').forEach(cb => {
        cb.addEventListener('change', () => {
          const id = cb.getAttribute('data-shop-check');
          const item = list.find(i => i.id === id);
          if (item && canEdit) {
            item.bought = cb.checked;
            Store.save('packing', data);
            renderTab();
          }
        });
      });
    }

    function attachItemHandlers(bagId) {
      const bag = data.bags.find(b => b.id === bagId);
      if (!bag) return;

      // Checkbox
      document.querySelectorAll('[data-check]').forEach(cb => {
        cb.addEventListener('change', () => {
          const id = cb.getAttribute('data-check');
          bag.categories.forEach(cat => {
            const item = cat.items.find(i => i.id === id);
            if (item && canEdit) {
              item.packed = cb.checked;
              Store.save('packing', data);
              renderTab();
            }
          });
        });
      });

      // Skip
      document.querySelectorAll('[data-skip]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-skip');
          bag.categories.forEach(cat => {
            const item = cat.items.find(i => i.id === id);
            if (item && canEdit) {
              item.skipped = !item.skipped;
              if (item.skipped) item.packed = false;
              Store.save('packing', data);
              renderTab();
            }
          });
        });
      });

      // Accordion toggle
      document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
          header.parentElement.classList.toggle('open');
        });
      });

      // Add item
      document.querySelectorAll('[data-add-item]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const catId = btn.getAttribute('data-add-item');
          const result = await window.showModal('Add Item', `
            <div class="flex-col gap-4">
              <div><label class="text-sm text-muted">Item name</label><input type="text" class="input mt-2" id="new-item-name" placeholder="Item name"></div>
              <div><label class="text-sm text-muted">Quantity</label><input type="number" class="input input-sm mt-2" id="new-item-qty" value="1" min="1"></div>
              <div><label class="text-sm text-muted">Notes</label><input type="text" class="input input-sm mt-2" id="new-item-notes" placeholder="Optional notes"></div>
            </div>
          `, [
            { label: 'Cancel', class: 'btn-ghost', value: null },
            { label: 'Add Item', class: 'btn-primary', value: 'add' }
          ]);

          if (result === 'add') {
            const name = document.getElementById('new-item-name')?.value?.trim();
            if (name) {
              const cat = bag.categories.find(c => c.id === catId);
              if (cat) {
                cat.items.push({
                  id: 'custom_' + Date.now(),
                  name,
                  quantity: parseInt(document.getElementById('new-item-qty')?.value) || 1,
                  estimatedWeight: 0,
                  packed: false,
                  skipped: false,
                  notes: document.getElementById('new-item-notes')?.value || '',
                  deadline: null
                });
                Store.save('packing', data);
                renderTab();
                window.showToast('Item added!', 'success');
              }
            }
          }
        });
      });
    }

    // Tab switching
    document.getElementById('packing-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      document.querySelectorAll('#packing-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.getAttribute('data-tab');
      renderTab();
    });

    // Search
    document.getElementById('packing-search').addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTab();
    });

    // Filters
    document.getElementById('filter-pills').addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter');
      renderTab();
    });

    // Print
    document.getElementById('btn-print')?.addEventListener('click', () => window.print());

    // Reset
    document.getElementById('btn-reset')?.addEventListener('click', async () => {
      const result = await window.showModal('Reset Packing List', 
        '<p class="text-sm">This will reset ALL packing items to unpacked. This cannot be undone.</p>',
        [{ label: 'Cancel', class: 'btn-ghost', value: null }, { label: 'Reset', class: 'btn-danger', value: 'reset' }]
      );
      if (result === 'reset') {
        data = JSON.parse(JSON.stringify(DEFAULT_PACKING));
        Store.save('packing', data);
        renderTab();
        window.showToast('Packing list reset', 'warning');
      }
    });

    renderTab();
  }

  return { render };
})();

export default Packing;
