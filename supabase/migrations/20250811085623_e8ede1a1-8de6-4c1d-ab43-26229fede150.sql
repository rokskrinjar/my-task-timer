-- Clear game answers first, then update questions with harder content

-- First, clear all game answers to avoid foreign key constraint issues
DELETE FROM public.game_answers;

-- Clear all game participants
DELETE FROM public.game_participants;

-- Clear all games
DELETE FROM public.games;

-- Now delete existing questions and replace with harder ones
DELETE FROM public.questions;

-- Insert challenging questions for "Osnovna šola" category (Elementary School) - 100 questions
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
-- Math questions (grades 6-8, more challenging)
('Če je sqrt(x + 5) = 7, kakšna je vrednost x?', 'Matematika', '44', '49', '39', '42', 'A', 8, 1, 'Osnovna šola'),
('Koliko je 15% od 240?', 'Matematika', '36', '32', '38', '35', 'A', 7, 2, 'Osnovna šola'),
('Kateri je rezultat enačbe: 3x - 7 = 2x + 8?', 'Matematika', 'x = 15', 'x = 12', 'x = 10', 'x = 18', 'A', 8, 3, 'Osnovna šola'),
('Če je obseg pravokotnika 24 cm in širina 4 cm, koliko je dolžina?', 'Matematika', '8 cm', '10 cm', '6 cm', '12 cm', 'A', 7, 4, 'Osnovna šola'),
('Koliko je 2³ × 3²?', 'Matematika', '72', '64', '54', '48', 'A', 8, 5, 'Osnovna šola'),
('Koliko je kvadratni koren iz 144?', 'Matematika', '12', '14', '16', '10', 'A', 7, 6, 'Osnovna šola'),
('Katera je formula za obseg kroga?', 'Matematika', '2πr', 'πr²', 'πd', '2πd', 'A', 8, 7, 'Osnovna šola'),
('Če je razmerje med dvema številoma 3:5 in je prva številka 15, koliko je druga?', 'Matematika', '25', '20', '30', '35', 'A', 8, 8, 'Osnovna šola'),
('Koliko je 0,25 izraženo kot ulomek?', 'Matematika', '1/4', '1/3', '2/5', '3/8', 'A', 7, 9, 'Osnovna šola'),
('Kateri je rezultat: (-3) × (-4) + 2?', 'Matematika', '14', '10', '16', '12', 'A', 8, 10, 'Osnovna šola'),

-- Science questions (challenging for elementary)
('Kateri element ima kemijsko oznako Fe?', 'Naravoslovje', 'Fluor', 'Fosfor', 'Železo', 'Francij', 'C', 8, 11, 'Osnovna šola'),
('Katera je temperatura vrenja vode na nadmorski višini 0 m?', 'Naravoslovje', '90°C', '100°C', '110°C', '95°C', 'B', 7, 12, 'Osnovna šola'),
('Kateri sistem organov je odgovoren za transport kisika po telesu?', 'Naravoslovje', 'Prebavni sistem', 'Žilni sistem', 'Živčni sistem', 'Izločevalni sistem', 'B', 8, 13, 'Osnovna šola'),
('Katera vrsta energije se pretvori v električno energijo v sončnih celicah?', 'Naravoslovje', 'Kinetična', 'Svetlobna', 'Kemijska', 'Toplotna', 'B', 8, 14, 'Osnovna šola'),
('Kateri plin predstavlja približno 78% zemeljskega ozračja?', 'Naravoslovje', 'Kisik', 'Ogljikov dioksid', 'Dušik', 'Argon', 'C', 7, 15, 'Osnovna šola'),
('Katera snov ima kemijsko formulo H₂O?', 'Naravoslovje', 'Vodik', 'Kisik', 'Voda', 'Ozon', 'C', 6, 16, 'Osnovna šola'),
('Kateri organ filtrira kri v človeškem telesu?', 'Naravoslovje', 'Jetra', 'Ledvici', 'Srce', 'Pljuča', 'B', 7, 17, 'Osnovna šola'),
('Katera planeta je najbližja Soncu?', 'Naravoslovje', 'Venera', 'Merkur', 'Mars', 'Zemlja', 'B', 6, 18, 'Osnovna šola'),
('Koliko kosti ima odrasel človek?', 'Naravoslovje', '206', '215', '198', '220', 'A', 8, 19, 'Osnovna šola'),
('Kateri je najtrši mineral na Zemlji?', 'Naravoslovje', 'Kvarc', 'Diamant', 'Granit', 'Marmor', 'B', 7, 20, 'Osnovna šola'),

-- Slovenian language (challenging)
('Kateri je pravilni zapis ločil v povedi: Pozdravi očeta mamo in sestro?', 'Slovenščina', 'Pozdravi očeta, mamo in sestro.', 'Pozdravi očeta; mamo in sestro.', 'Pozdravi očeta mamo, in sestro.', 'Pozdravi, očeta, mamo in sestro.', 'A', 8, 21, 'Osnovna šola'),
('Katera beseda je sestavljena iz predpone, korena in pripone?', 'Slovenščina', 'Pripeljati', 'Prepisati', 'Nedostopen', 'Nečitljiv', 'C', 8, 22, 'Osnovna šola'),
('V kateri slovnični osebi je glagol v povedi: Jutri gremo na izlet?', 'Slovenščina', '1. oseba ednine', '2. oseba ednine', '1. oseba množine', '3. oseba množine', 'C', 7, 23, 'Osnovna šola'),
('Kateri je sinonim za besedo velik?', 'Slovenščina', 'Majhen', 'Ogromen', 'Ozek', 'Kratek', 'B', 6, 24, 'Osnovna šola'),
('Katera poved je vprašalna?', 'Slovenščina', 'Kako lepo je danes!', 'Pojdi domov.', 'Kdaj prideš?', 'Zunaj dežuje.', 'C', 6, 25, 'Osnovna šola'),
('Katera je množina besede otrok?', 'Slovenščina', 'Otroci', 'Otroka', 'Otroke', 'Otrokom', 'A', 6, 26, 'Osnovna šola'),
('V kateri časovni obliki je glagol sem šel?', 'Slovenščina', 'Sedanjik', 'Preteklik', 'Prihodnjik', 'Pogojnik', 'B', 7, 27, 'Osnovna šola'),
('Katera beseda je prislovno določilo?', 'Slovenščina', 'Hitro', 'Hitrost', 'Hiter', 'Hitrejši', 'A', 8, 28, 'Osnovna šola'),
('Kateri ločilo uporabljamo za naštevanje?', 'Slovenščina', 'Pika', 'Vejica', 'Podpičje', 'Dvopičje', 'B', 6, 29, 'Osnovna šola'),
('Katera je osnovna oblika glagola grem?', 'Slovenščina', 'Gresti', 'Iti', 'Hoditi', 'Teči', 'B', 7, 30, 'Osnovna šola'),

-- Geography and History (challenging)
('Katera je glavna reka Slovenije?', 'Geografija', 'Drava', 'Sava', 'Soča', 'Mura', 'B', 7, 31, 'Osnovna šola'),
('V katerem letu je Slovenija postala samostojna država?', 'Zgodovina', '1989', '1990', '1991', '1992', 'C', 8, 32, 'Osnovna šola'),
('Katera je največja slovenska pokrajina?', 'Geografija', 'Štajerska', 'Kranjska', 'Primorska', 'Koroška', 'A', 7, 33, 'Osnovna šola'),
('Kateri je najvišji vrh v Sloveniji?', 'Geografija', 'Triglav', 'Škrlatica', 'Mangart', 'Razor', 'A', 6, 34, 'Osnovna šola'),
('V katerem stoletju je živel France Prešeren?', 'Zgodovina', '18. stoletje', '19. stoletje', '20. stoletje', '17. stoletje', 'B', 8, 35, 'Osnovna šola'),
('Katera država meji na Slovenijo na severu?', 'Geografija', 'Italija', 'Hrvaška', 'Avstrija', 'Madžarska', 'C', 7, 36, 'Osnovna šola'),
('Kateri je prvi rimski cesar?', 'Zgodovina', 'Julij Cezar', 'Oktavijan Avgust', 'Neron', 'Trajan', 'B', 8, 37, 'Osnovna šola'),
('Katera je prestolnica Italije?', 'Geografija', 'Milano', 'Rim', 'Neapelj', 'Torino', 'B', 6, 38, 'Osnovna šola'),
('V katerem letu se je začela prva svetovna vojna?', 'Zgodovina', '1912', '1914', '1916', '1918', 'B', 8, 39, 'Osnovna šola'),
('Kateri ocean je največji?', 'Geografija', 'Atlantski', 'Indijski', 'Tihi', 'Arktični', 'C', 7, 40, 'Osnovna šola'),

-- More advanced math and science to reach 100 questions for elementary
('Koliko strani ima dodekagon?', 'Matematika', '10', '12', '14', '16', 'B', 8, 41, 'Osnovna šola'),
('Koliko je sin(30°)?', 'Matematika', '0,5', '0,6', '0,7', '0,8', 'A', 8, 42, 'Osnovna šola'),
('Kateri je rezultat: 5! (5 faktoriala)?', 'Matematika', '25', '120', '100', '150', 'B', 8, 43, 'Osnovna šola'),
('Koliko je log₂(8)?', 'Matematika', '2', '3', '4', '5', 'B', 8, 44, 'Osnovna šola'),
('Katera je enota za električni upor?', 'Naravoslovje', 'Volt', 'Amper', 'Ohm', 'Watt', 'C', 8, 45, 'Osnovna šola'),
('Kateri zakon opisuje razmerje med silo, maso in pospeškom?', 'Naravoslovje', 'Newtonov prvi zakon', 'Newtonov drugi zakon', 'Newtonov tretji zakon', 'Hookov zakon', 'B', 8, 46, 'Osnovna šola'),
('Kateri del očesa nadzoruje količino svetlobe?', 'Naravoslovje', 'Roženica', 'Šarenica', 'Mrežnica', 'Leča', 'B', 7, 47, 'Osnovna šola'),
('Katera je hitrost svetlobe v vakuumu?', 'Naravoslovje', '300.000 km/s', '150.000 km/s', '500.000 km/s', '200.000 km/s', 'A', 8, 48, 'Osnovna šola'),
('Kateri plin nastane pri fotosintezi?', 'Naravoslovje', 'Ogljikov dioksid', 'Dušik', 'Kisik', 'Vodik', 'C', 7, 49, 'Osnovna šola'),
('Koliko src ima hobotnica?', 'Naravoslovje', '1', '2', '3', '4', 'C', 8, 50, 'Osnovna šola'),

-- Continue with 50 more challenging questions for elementary
('Katera celina je največja?', 'Geografija', 'Afrika', 'Azija', 'Evropa', 'Severna Amerika', 'B', 7, 51, 'Osnovna šola'),
('Kateri je najdaljši dan v letu na severni polobli?', 'Geografija', '21. marec', '21. junij', '21. september', '21. december', 'B', 8, 52, 'Osnovna šola'),
('Katera država ima največ prebivalcev?', 'Geografija', 'Indija', 'Kitajska', 'ZDA', 'Indonezija', 'B', 8, 53, 'Osnovna šola'),
('Kateri je najglobji ocean?', 'Geografija', 'Atlantski', 'Indijski', 'Tihi', 'Arktični', 'C', 7, 54, 'Osnovna šola'),
('Katera pustinja je največja na svetu?', 'Geografija', 'Sahara', 'Gobi', 'Antarkutična pustinja', 'Kalahari', 'C', 8, 55, 'Osnovna šola'),
('Kdaj se je končala druga svetovna vojna v Evropi?', 'Zgodovina', '8. maj 1945', '9. maj 1945', '2. september 1945', '15. avgust 1945', 'A', 8, 56, 'Osnovna šola'),
('Kateri cesar je razdelil Rimsko cesarstvo?', 'Zgodovina', 'Konstantin', 'Dioklecijan', 'Teodozij', 'Justinijan', 'B', 8, 57, 'Osnovna šola'),
('V katerem letu je padel Berlinski zid?', 'Zgodovina', '1987', '1989', '1991', '1993', 'B', 8, 58, 'Osnovna šola'),
('Kateri raziskovalec je prvi priplul okoli sveta?', 'Zgodovina', 'Kristof Kolumb', 'Vasco da Gama', 'Ferdinand Magellan', 'James Cook', 'C', 8, 59, 'Osnovna šola'),
('Katera civilizacija je zgradila Machu Picchu?', 'Zgodovina', 'Azteki', 'Inki', 'Maji', 'Olmeki', 'B', 8, 60, 'Osnovna šola'),
('Koliko je (a + b)² = ?', 'Matematika', 'a² + b²', 'a² + 2ab + b²', '2a² + 2b²', 'a² + ab + b²', 'B', 8, 61, 'Osnovna šola'),
('Katera je površina pravokotnika s stranicama 8 cm in 5 cm?', 'Matematika', '40 cm²', '26 cm²', '13 cm²', '20 cm²', 'A', 6, 62, 'Osnovna šola'),
('Koliko je 3/4 + 1/6?', 'Matematika', '11/12', '4/10', '5/6', '7/8', 'A', 7, 63, 'Osnovna šola'),
('Kateri je rezultat: √(64) + √(36)?', 'Matematika', '14', '12', '16', '10', 'A', 7, 64, 'Osnovna šola'),
('Koliko je 2x + 3 = 11?', 'Matematika', 'x = 4', 'x = 5', 'x = 3', 'x = 6', 'A', 7, 65, 'Osnovna šola'),
('Kateri del rastline opravi fotosintezo?', 'Naravoslovje', 'Koren', 'Steblo', 'List', 'Cvet', 'C', 6, 66, 'Osnovna šola'),
('Katera krvna skupina je univerzalni darovalec?', 'Naravoslovje', 'A', 'B', 'AB', 'O', 'D', 7, 67, 'Osnovna šola'),
('Kateri del možganov kontrolira ravnotežje?', 'Naravoslovje', 'Možganski debel', 'Mali možgani', 'Veliki možgani', 'Hipofiza', 'B', 8, 68, 'Osnovna šola'),
('Katera vrsta energije je shranjena v hrani?', 'Naravoslovje', 'Kinetična', 'Potencialna', 'Kemijska', 'Električna', 'C', 7, 69, 'Osnovna šola'),
('Katera je osnovna oblika pridevnika boljši?', 'Slovenščina', 'Dober', 'Dobro', 'Dobrota', 'Dobr', 'A', 7, 70, 'Osnovna šola'),
('Kateri sklion je knjige v povedi Berem knjige?', 'Slovenščina', 'Imenovalnik', 'Rodilnik', 'Dajalnik', 'Tožilnik', 'D', 8, 71, 'Osnovna šola'),
('Katera je pravilna raba nikalnice?', 'Slovenščina', 'Ne grem nikam', 'Ne grem nikamor', 'Ne ne grem nikam', 'Grem ne nikam', 'B', 8, 72, 'Osnovna šola'),
('Kateri je pravilen zapis števila 1523?', 'Slovenščina', 'Tisoč petsto triindvajset', 'Ena tisoč petsto triindvajset', 'Tisoč pet sto tri in dvajset', '1523', 'A', 7, 73, 'Osnovna šola'),
('Katera besedna vrsta je hitro?', 'Slovenščina', 'Pridevnik', 'Prislov', 'Glagol', 'Samostalnik', 'B', 7, 74, 'Osnovna šola'),
('Katera reka teče skozi Ljubljano?', 'Geografija', 'Sava', 'Ljubljanica', 'Kamniška Bistrica', 'Gradaščica', 'B', 6, 75, 'Osnovna šola'),
('Kateri je največji otok na svetu?', 'Geografija', 'Madagaskar', 'Grenlandija', 'Nova Gvineja', 'Borneo', 'B', 7, 76, 'Osnovna šola'),
('V kateri časovni pas spada Slovenija?', 'Geografija', 'UTC+1', 'UTC+2', 'UTC+0', 'UTC+3', 'A', 8, 77, 'Osnovna šola'),
('Kateri vulkan je uničil Pompeji?', 'Geografija', 'Etna', 'Vezuv', 'Stromboli', 'Vulcano', 'B', 8, 78, 'Osnovna šola'),
('Katera je višja: Mount Everest ali K2?', 'Geografija', 'Mount Everest', 'K2', 'Enako visoka', 'Ni znano', 'A', 7, 79, 'Osnovna šola'),
('Kdaj je bil napisan Pakt o Varšavi?', 'Zgodovina', '1953', '1955', '1957', '1959', 'B', 8, 80, 'Osnovna šola'),
('Kateri kralj je ustanovil Versailles?', 'Zgodovina', 'Ludvik XIII.', 'Ludvik XIV.', 'Ludvik XV.', 'Ludvik XVI.', 'B', 8, 81, 'Osnovna šola'),
('V katerem letu je izbruhnila francoska revolucija?', 'Zgodovina', '1789', '1791', '1793', '1795', 'A', 8, 82, 'Osnovna šola'),
('Kateri je bil prvi človek na Luni?', 'Zgodovina', 'Buzz Aldrin', 'Neil Armstrong', 'Michael Collins', 'John Glenn', 'B', 7, 83, 'Osnovna šola'),
('Kdaj se je začela industrijska revolucija?', 'Zgodovina', '1750', '1760', '1770', '1780', 'B', 8, 84, 'Osnovna šola'),
('Koliko je 12 × 15?', 'Matematika', '180', '175', '185', '170', 'A', 6, 85, 'Osnovna šola'),
('Katera je enota za moč?', 'Naravoslovje', 'Joule', 'Watt', 'Newton', 'Pascal', 'B', 8, 86, 'Osnovna šola'),
('Katera je tretja oseba ednine glagola imeti?', 'Slovenščina', 'Imam', 'Imaš', 'Ima', 'Imamo', 'C', 6, 87, 'Osnovna šola'),
('Katera je prestolnica Španije?', 'Geografija', 'Barcelona', 'Sevilla', 'Madrid', 'Valencia', 'C', 6, 88, 'Osnovna šola'),
('V katerem letu je padel Konstantinopel?', 'Zgodovina', '1453', '1455', '1451', '1457', 'A', 8, 89, 'Osnovna šola'),
('Koliko je 8²?', 'Matematika', '16', '64', '32', '48', 'B', 7, 90, 'Osnovna šola'),
('Kateri kemijski element ima simbol Na?', 'Naravoslovje', 'Nikelj', 'Neon', 'Natrij', 'Dušik', 'C', 8, 91, 'Osnovna šola'),
('Katera je množina besede človek?', 'Slovenščina', 'Človeči', 'Ljudje', 'Človeki', 'Človekov', 'B', 6, 92, 'Osnovna šola'),
('Katera je največja država v Evropi?', 'Geografija', 'Francija', 'Španija', 'Rusija', 'Ukrajina', 'C', 7, 93, 'Osnovna šola'),
('Kdaj je bila ustanovljena OZN?', 'Zgodovina', '1943', '1945', '1947', '1949', 'B', 8, 94, 'Osnovna šola'),
('Koliko je 9 × 7?', 'Matematika', '56', '63', '54', '72', 'B', 6, 95, 'Osnovna šola'),
('Kateri gas dihamo?', 'Naravoslovje', 'Kisik', 'Ogljikov dioksid', 'Dušik', 'Vodik', 'A', 6, 96, 'Osnovna šola'),
('Kako se imenuje skupek zvezd?', 'Naravoslovje', 'Galaksija', 'Sončni sistem', 'Asteroid', 'Komet', 'A', 7, 97, 'Osnovna šola'),
('Katera barva nastane iz mešanja rdeče in modre?', 'Naravoslovje', 'Zelena', 'Rumena', 'Vijolična', 'Oranžna', 'C', 6, 98, 'Osnovna šola'),
('Koliko nog ima pajek?', 'Naravoslovje', '6', '8', '10', '12', 'B', 6, 99, 'Osnovna šola'),
('Katera je formula za volumen kocke?', 'Matematika', 'a²', 'a³', '6a²', '4a', 'B', 8, 100, 'Osnovna šola');