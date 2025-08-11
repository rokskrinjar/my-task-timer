-- First, let's add more challenging questions for existing categories and the new Sports category

-- Delete existing easy questions to replace with harder ones
DELETE FROM public.questions;

-- Insert challenging questions for "Osnovna šola" category (Elementary School)
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
-- Advanced Math Questions
('Če je sqrt(x + 5) = 7, kakšna je vrednost x?', 'Matematika', '44', '49', '39', '42', 'A', 8, 1, 'Osnovna šola'),
('Koliko je 15% od 240?', 'Matematika', '36', '32', '38', '35', 'A', 7, 2, 'Osnovna šola'),
('Kateri je rezultat enačbe: 3x - 7 = 2x + 8?', 'Matematika', 'x = 15', 'x = 12', 'x = 10', 'x = 18', 'A', 8, 3, 'Osnovna šola'),
('Če je obseg pravokotnika 24 cm in širina 4 cm, koliko je dolžina?', 'Matematika', '8 cm', '10 cm', '6 cm', '12 cm', 'A', 7, 4, 'Osnovna šola'),
('Koliko je 2³ × 3²?', 'Matematika', '72', '64', '54', '48', 'A', 8, 5, 'Osnovna šola'),

-- Advanced Science Questions
('Kateri element ima kemijsko oznako Fe?', 'Naravoslovje', 'Fluor', 'Fosfor', 'Železo', 'Francij', 'C', 8, 6, 'Osnovna šola'),
('Katera je temperatura vrenja vode na nadmorski višini 0 m?', 'Naravoslovje', '90°C', '100°C', '110°C', '95°C', 'B', 7, 7, 'Osnovna šola'),
('Kateri sistem organov je odgovoren za transport kisika po telesu?', 'Naravoslovje', 'Prebavni sistem', 'Žilni sistem', 'Živčni sistem', 'Izločevalni sistem', 'B', 8, 8, 'Osnovna šola'),
('Katera vrsta energije se pretvori v električno energijo v sončnih celicah?', 'Naravoslovje', 'Kinetična', 'Svetlobna', 'Kemijska', 'Toplotna', 'B', 8, 9, 'Osnovna šola'),
('Kateri plin predstavlja približno 78% zemeljskega ozračja?', 'Naravoslovje', 'Kisik', 'Ogljikov dioksid', 'Dušik', 'Argon', 'C', 7, 10, 'Osnovna šola'),

-- Advanced Slovenian Language Questions
('Kateri je pravilni zapis ločil v povedi: "Pozdravi očeta mamo in sestro"?', 'Slovenščina', 'Pozdravi očeta, mamo in sestro.', 'Pozdravi očeta; mamo in sestro.', 'Pozdravi očeta mamo, in sestro.', 'Pozdravi, očeta, mamo in sestro.', 'A', 8, 11, 'Osnovna šola'),
('Katera beseda je sestavljena iz predpone, korena in pripone?', 'Slovenščina', 'Pripeljati', 'Prepisati', 'Nedostopen', 'Nečitljiv', 'C', 8, 12, 'Osnovna šola'),
('V kateri slovnični osebi je glagol v povedi: "Jutri gremo na izlet"?', 'Slovenščina', '1. oseba ednine', '2. oseba ednine', '1. oseba množine', '3. oseba množine', 'C', 7, 13, 'Osnovna šola'),
('Kateri je sinonim za besedo "velik"?', 'Slovenščina', 'Majhen', 'Ogromen', 'Ozek', 'Kratek', 'B', 6, 14, 'Osnovna šola'),
('Katera poved je vprašalna?', 'Slovenščina', 'Kako lepo je danes!', 'Pojdi domov.', 'Kdaj prideš?', 'Zunaj dežuje.', 'C', 6, 15, 'Osnovna šola'),

-- Advanced Geography/History Questions
('Katera je glavna reka Slovenije?', 'Geografija', 'Drava', 'Sava', 'Soča', 'Mura', 'B', 7, 16, 'Osnovna šola'),
('V katerem letu je Slovenija postala samostojna država?', 'Zgodovina', '1989', '1990', '1991', '1992', 'C', 8, 17, 'Osnovna šola'),
('Katera je največja slovenska pokrajina?', 'Geografija', 'Štajerska', 'Kranjska', 'Primorska', 'Koroška', 'A', 7, 18, 'Osnovna šola'),
('Kateri je najvišji vrh v Sloveniji?', 'Geografija', 'Triglav', 'Škrlatica', 'Mangart', 'Razor', 'A', 6, 19, 'Osnovna šola'),
('V katerem stoletju je živel France Prešeren?', 'Zgodovina', '18. stoletje', '19. stoletje', '20. stoletje', '17. stoletje', 'B', 8, 20, 'Osnovna šola'),

-- Continue with more challenging questions for all remaining slots (21-100)
('Koliko je kvadratni koren iz 144?', 'Matematika', '12', '14', '16', '10', 'A', 7, 21, 'Osnovna šola'),
('Katera je formula za obseg kroga?', 'Matematika', '2πr', 'πr²', 'πd', '2πd', 'A', 8, 22, 'Osnovna šola'),
('Če je razmerje med dvema številoma 3:5 in je prva številka 15, koliko je druga?', 'Matematika', '25', '20', '30', '35', 'A', 8, 23, 'Osnovna šola'),
('Koliko je 0,25 izraženo kot ulomek?', 'Matematika', '1/4', '1/3', '2/5', '3/8', 'A', 7, 24, 'Osnovna šola'),
('Kateri je rezultat: (-3) × (-4) + 2?', 'Matematika', '14', '10', '16', '12', 'A', 8, 25, 'Osnovna šola'),

('Katera snov ima kemijsko formulo H₂O?', 'Naravoslovje', 'Vodik', 'Kisik', 'Voda', 'Ozon', 'C', 6, 26, 'Osnovna šola'),
('Kateri organ filtrira kri v človeškem telesu?', 'Naravoslovje', 'Jetra', 'Ledvici', 'Srce', 'Pljuča', 'B', 7, 27, 'Osnovna šola'),
('Katera planeta je najbližja Soncu?', 'Naravoslovje', 'Venera', 'Merkur', 'Mars', 'Zemlja', 'B', 6, 28, 'Osnovna šola'),
('Koliko kosti ima odrasel človek?', 'Naravoslovje', '206', '215', '198', '220', 'A', 8, 29, 'Osnovna šola'),
('Kateri je najtrši mineral na Zemlji?', 'Naravoslovje', 'Kvarc', 'Diamant', 'Granit', 'Marmor', 'B', 7, 30, 'Osnovna šola'),

('Katera je množina besede "otrok"?', 'Slovenščina', 'Otroci', 'Otroka', 'Otroke', 'Otrokom', 'A', 6, 31, 'Osnovna šola'),
('V kateri časovni obliki je glagol "sem šel"?', 'Slovenščina', 'Sedanjik', 'Preteklik', 'Prihodnjik', 'Pogojnik', 'B', 7, 32, 'Osnovna šola'),
('Katera beseda je prislovno določilo?', 'Slovenščina', 'Hitro', 'Hitrost', 'Hiter', 'Hitrejši', 'A', 8, 33, 'Osnovna šola'),
('Kateri ločilo uporabljamo za naštevanje?', 'Slovenščina', 'Pika', 'Vejica', 'Podpičje', 'Dvopičje', 'B', 6, 34, 'Osnovna šola'),
('Katera je osnovna oblika glagola "grem"?', 'Slovenščina', 'Gresti', 'Iti', 'Hoditi', 'Teči', 'B', 7, 35, 'Osnovna šola'),

('Katera država meji na Slovenijo na severu?', 'Geografija', 'Italija', 'Hrvaška', 'Avstrija', 'Madžarska', 'C', 7, 36, 'Osnovna šola'),
('Kateri je prvi rimski cesar?', 'Zgodovina', 'Julij Cezar', 'Oktavijan Avgust', 'Neron', 'Trajan', 'B', 8, 37, 'Osnovna šola'),
('Katera je prestolnica Italije?', 'Geografija', 'Milano', 'Rim', 'Neapelj', 'Torino', 'B', 6, 38, 'Osnovna šola'),
('V katerem letu se je začela prva svetovna vojna?', 'Zgodovina', '1912', '1914', '1916', '1918', 'B', 8, 39, 'Osnovna šola'),
('Kateri ocean je največji?', 'Geografija', 'Atlantski', 'Indijski', 'Tihi', 'Arktični', 'C', 7, 40, 'Osnovna šola'),

-- Adding 60 more challenging questions to reach 100
('Koliko strani ima dodekagon?', 'Matematika', '10', '12', '14', '16', 'B', 8, 41, 'Osnovna šola'),
('Katera je inverz funkcije f(x) = 2x + 3?', 'Matematika', 'f⁻¹(x) = (x-3)/2', 'f⁻¹(x) = (x+3)/2', 'f⁻¹(x) = 2x-3', 'f⁻¹(x) = x/2-3', 'A', 8, 42, 'Osnovna šola'),
('Koliko je sin(30°)?', 'Matematika', '0,5', '0,6', '0,7', '0,8', 'A', 8, 43, 'Osnovna šola'),
('Kateri je rezultat: 5! (5 faktoriala)?', 'Matematika', '25', '120', '100', '150', 'B', 8, 44, 'Osnovna šola'),
('Koliko je log₂(8)?', 'Matematika', '2', '3', '4', '5', 'B', 8, 45, 'Osnovna šola'),

('Katera je enota za električni upor?', 'Naravoslovje', 'Volt', 'Amper', 'Ohm', 'Watt', 'C', 8, 46, 'Osnovna šola'),
('Kateri zakon opisuje razmerje med silo, maso in pospeškom?', 'Naravoslovje', 'Newtonov prvi zakon', 'Newtonov drugi zakon', 'Newtonov tretji zakon', 'Hookov zakon', 'B', 8, 47, 'Osnovna šola'),
('Kateri del očesa nadzoruje količino svetlobe?', 'Naravoslovje', 'Roženica', 'Šarenica', 'Mrežnica', 'Leča', 'B', 7, 48, 'Osnovna šola'),
('Katera je hitrost svetlobe v vakuumu?', 'Naravoslovje', '300.000 km/s', '150.000 km/s', '500.000 km/s', '200.000 km/s', 'A', 8, 49, 'Osnovna šola'),
('Kateri plin nastane pri fotosintezi?', 'Naravoslovje', 'Ogljikov dioksid', 'Dušik', 'Kisik', 'Vodik', 'C', 7, 50, 'Osnovna šola'),

('Katera je povratna oblika glagola "videti"?', 'Slovenščina', 'Videti se', 'Zagledati se', 'Pokazati se', 'Kazati se', 'A', 8, 51, 'Osnovna šola'),
('Katera je pravilna raba velike začetnice?', 'Slovenščina', 'torek', 'Torek', 'januar', 'Januar', 'B', 7, 52, 'Osnovna šola'),
('Kateri stavčni člen je beseda "počasi" v povedi "Počasi hodi po cesti"?', 'Slovenščina', 'Povedek', 'Prislovno določilo', 'Predmet', 'Prislovni določik', 'B', 8, 53, 'Osnovna šola'),
('Katera je množina besede "miš"?', 'Slovenščina', 'Miši', 'Miše', 'Miška', 'Mišk', 'A', 6, 54, 'Osnovna šola'),
('V kateri osebi je glagol "bereš"?', 'Slovenščina', '1. oseba ednine', '2. oseba ednine', '3. oseba ednine', '1. oseba množine', 'B', 7, 55, 'Osnovna šola'),

('Katera celina je največja?', 'Geografija', 'Afrika', 'Azija', 'Evropa', 'Severna Amerika', 'B', 7, 56, 'Osnovna šola'),
('Kateri je najdaljši dan v letu na severni polobli?', 'Geografija', '21. marec', '21. junij', '21. september', '21. december', 'B', 8, 57, 'Osnovna šola'),
('Katera država ima največ prebivalcev?', 'Geografija', 'Indija', 'Kitajska', 'ZDA', 'Indonezija', 'B', 8, 58, 'Osnovna šola'),
('Kateri je najglobji ocean?', 'Geografija', 'Atlantski', 'Indijski', 'Tihi', 'Arktični', 'C', 7, 59, 'Osnovna šola'),
('Katera pustinja je največja na svetu?', 'Geografija', 'Sahara', 'Gobi', 'Antarkutična pustinja', 'Kalahari', 'C', 8, 60, 'Osnovna šola'),

('Kdaj se je končala druga svetovna vojna v Evropi?', 'Zgodovina', '8. maj 1945', '9. maj 1945', '2. september 1945', '15. avgust 1945', 'A', 8, 61, 'Osnovna šola'),
('Kateri cesar je razdelil Rimsko cesarstvo?', 'Zgodovina', 'Konstantin', 'Dioklecijan', 'Teodozij', 'Justinijan', 'B', 8, 62, 'Osnovna šola'),
('V katerem letu je padel Berlinski zid?', 'Zgodovina', '1987', '1989', '1991', '1993', 'B', 8, 63, 'Osnovna šola'),
('Kateri raziskovalec je prvi priplul okoli sveta?', 'Zgodovina', 'Kristof Kolumb', 'Vasco da Gama', 'Ferdinand Magellan', 'James Cook', 'C', 8, 64, 'Osnovna šola'),
('Katera civilizacija je zgradila Machu Picchu?', 'Zgodovina', 'Azteki', 'Inki', 'Maji', 'Olmeki', 'B', 8, 65, 'Osnovna šola'),

-- Adding final 35 questions to reach 100
('Koliko je (a + b)² = ?', 'Matematika', 'a² + b²', 'a² + 2ab + b²', '2a² + 2b²', 'a² + ab + b²', 'B', 8, 66, 'Osnovna šola'),
('Katera je površina pravokotnika s stranicama 8 cm in 5 cm?', 'Matematika', '40 cm²', '26 cm²', '13 cm²', '20 cm²', 'A', 6, 67, 'Osnovna šola'),
('Koliko je 3/4 + 1/6?', 'Matematika', '11/12', '4/10', '5/6', '7/8', 'A', 7, 68, 'Osnovna šola'),
('Kateri je rezultat: √(64) + √(36)?', 'Matematika', '14', '12', '16', '10', 'A', 7, 69, 'Osnovna šola'),
('Koliko je 2x + 3 = 11?', 'Matematika', 'x = 4', 'x = 5', 'x = 3', 'x = 6', 'A', 7, 70, 'Osnovna šola'),

('Kateri del rastline opravi fotosintezo?', 'Naravoslovje', 'Koren', 'Steblo', 'List', 'Cvet', 'C', 6, 71, 'Osnovna šola'),
('Katera krvna skupina je univerzalni darovalec?', 'Naravoslovje', 'A', 'B', 'AB', 'O', 'D', 7, 72, 'Osnovna šola'),
('Koliko src ima hobotnica?', 'Naravoslovje', '1', '2', '3', '4', 'C', 8, 73, 'Osnovna šola'),
('Kateri del možganov kontrolira ravnotežje?', 'Naravoslovje', 'Možganski debel', 'Mali možgani', 'Veliki možgani', 'Hipofiza', 'B', 8, 74, 'Osnovna šola'),
('Katera vrsta energije je shranjena v hrani?', 'Naravoslovje', 'Kinetična', 'Potencialna', 'Kemijska', 'Električna', 'C', 7, 75, 'Osnovna šola'),

('Katera je osnovna oblika pridevnika "boljši"?', 'Slovenščina', 'Dober', 'Dobro', 'Dobrota', 'Dobr', 'A', 7, 76, 'Osnovna šola'),
('Kateri sklion je "knjige" v povedi "Berem knjige"?', 'Slovenščina', 'Imenovalnik', 'Rodilnik', 'Dajalnik', 'Tožilnik', 'D', 8, 77, 'Osnovna šola'),
('Katera je pravilna raba nikalnice?', 'Slovenščina', 'Ne grem nikam', 'Ne grem nikamor', 'Ne ne grem nikam', 'Grem ne nikam', 'B', 8, 78, 'Osnovna šola'),
('Kateri je pravilen zapis števila 1523?', 'Slovenščina', 'Tisoč petsto triindvajset', 'Ena tisoč petsto triindvajset', 'Tisoč pet sto tri in dvajset', '1523', 'A', 7, 79, 'Osnovna šola'),
('Katera besedna vrsta je "hitro"?', 'Slovenščina', 'Pridevnik', 'Prislov', 'Glagol', 'Samostalnik', 'B', 7, 80, 'Osnovna šola'),

('Katera reka teče skozi Ljubljano?', 'Geografija', 'Sava', 'Ljubljanica', 'Kamniška Bistrica', 'Gradaščica', 'B', 6, 81, 'Osnovna šola'),
('Kateri je največji otok na svetu?', 'Geografija', 'Madagaskar', 'Grenlandija', 'Nova Gvineja', 'Borneo', 'B', 7, 82, 'Osnovna šola'),
('V kateri časovni pas spada Slovenija?', 'Geografija', 'UTC+1', 'UTC+2', 'UTC+0', 'UTC+3', 'A', 8, 83, 'Osnovna šola'),
('Kateri vulkan je uničil Pompeji?', 'Geografija', 'Etna', 'Vezuv', 'Stromboli', 'Vulcano', 'B', 8, 84, 'Osnovna šola'),
('Katera je višja: Mount Everest ali K2?', 'Geografija', 'Mount Everest', 'K2', 'Enako visoka', 'Ni znano', 'A', 7, 85, 'Osnovna šola'),

('Kdaj je bil napisan Pakt o Varšavi?', 'Zgodovina', '1953', '1955', '1957', '1959', 'B', 8, 86, 'Osnovna šola'),
('Kateri kralj je ustanovil Versailles?', 'Zgodovina', 'Ludvik XIII.', 'Ludvik XIV.', 'Ludvik XV.', 'Ludvik XVI.', 'B', 8, 87, 'Osnovna šola'),
('V katerem letu je izbruhnila francoska revolucija?', 'Zgodovina', '1789', '1791', '1793', '1795', 'A', 8, 88, 'Osnovna šola'),
('Kateri je bil prvi človek na Luni?', 'Zgodovina', 'Buzz Aldrin', 'Neil Armstrong', 'Michael Collins', 'John Glenn', 'B', 7, 89, 'Osnovna šola'),
('Kdaj se je začela industrijska revolucija?', 'Zgodovina', '1750', '1760', '1770', '1780', 'B', 8, 90, 'Osnovna šola'),

-- Final 10 questions
('Koliko je 12 × 15?', 'Matematika', '180', '175', '185', '170', 'A', 6, 91, 'Osnovna šola'),
('Katera je enota za moč?', 'Naravoslovje', 'Joule', 'Watt', 'Newton', 'Pascal', 'B', 8, 92, 'Osnovna šola'),
('Katera je tretja oseba ednine glagola "imeti"?', 'Slovenščina', 'Imam', 'Imaš', 'Ima', 'Imamo', 'C', 6, 93, 'Osnovna šola'),
('Katera je prestolnica Španije?', 'Geografija', 'Barcelona', 'Sevilla', 'Madrid', 'Valencia', 'C', 6, 94, 'Osnovna šola'),
('V katerem letu je padel Konstantinopel?', 'Zgodovina', '1453', '1455', '1451', '1457', 'A', 8, 95, 'Osnovna šola'),
('Koliko je 8²?', 'Matematika', '16', '64', '32', '48', 'B', 7, 96, 'Osnovna šola'),
('Kateri kemijski element ima simbol Na?', 'Naravoslovje', 'Nikelj', 'Neon', 'Natrij', 'Dušik', 'C', 8, 97, 'Osnovna šola'),
('Katera je množina besede "človek"?', 'Slovenščina', 'Človeči', 'Ljudje', 'Človeki', 'Človekov', 'B', 6, 98, 'Osnovna šola'),
('Katera je največja država v Evropi?', 'Geografija', 'Francija', 'Španija', 'Rusija', 'Ukrajina', 'C', 7, 99, 'Osnovna šola'),
('Kdaj je bila ustanovljena OZN?', 'Zgodovina', '1943', '1945', '1947', '1949', 'B', 8, 100, 'Osnovna šola');

-- Insert challenging questions for "Srednja šola" category (High School)
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
-- Advanced Math Questions
('Koliko je integral ∫x² dx?', 'Matematika', 'x³/3 + C', 'x³ + C', '2x + C', 'x³/2 + C', 'A', 11, 1, 'Srednja šola'),
('Katera je derivacija funkcije f(x) = e^x?', 'Matematika', 'e^x', 'xe^(x-1)', 'e^(x+1)', 'x·e^x', 'A', 12, 2, 'Srednja šola'),
('Koliko je lim(x→0) (sin x)/x?', 'Matematika', '0', '1', '∞', 'Ne obstaja', 'B', 12, 3, 'Srednja šola'),
('Katera je enačba premice, ki gre skozi točki A(1,2) in B(3,6)?', 'Matematika', 'y = 2x', 'y = 2x + 1', 'y = x + 1', 'y = 3x - 1', 'A', 11, 4, 'Srednja šola'),
('Koliko je determinanta matrike [[2,3],[1,4]]?', 'Matematika', '5', '8', '11', '7', 'A', 12, 5, 'Srednja šola'),

-- Advanced Physics
('Katera je enačba za kinetično energijo?', 'Fizika', 'E = mc²', 'E = ½mv²', 'E = mgh', 'E = Fd', 'B', 11, 6, 'Srednja šola'),
('Kateri zakon opisuje razmerje med napetostjo, tokom in uporom?', 'Fizika', 'Kirchhoffov zakon', 'Ohmov zakon', 'Coulombov zakon', 'Faradayev zakon', 'B', 10, 7, 'Srednja šola'),
('Koliko je hitrost zvoka v zraku pri 20°C?', 'Fizika', '343 m/s', '300 m/s', '340 m/s', '350 m/s', 'A', 11, 8, 'Srednja šola'),
('Katera je SI enota za električni naboj?', 'Fizika', 'Amper', 'Coulomb', 'Volt', 'Ohm', 'B', 10, 9, 'Srednja šola'),
('Kateri princip opisuje vztrajnost telesa?', 'Fizika', 'Newtonov prvi zakon', 'Newtonov drugi zakon', 'Zakon o ohranitvi energije', 'Bernoullijeva enačba', 'A', 10, 10, 'Srednja šola'),

-- Advanced Chemistry
('Kakšna je Avogadrova konstanta?', 'Kemija', '6,022 × 10²³', '6,022 × 10²²', '3,14 × 10²³', '1,602 × 10⁻¹⁹', 'A', 11, 11, 'Srednja šola'),
('Kateri element ima atomsko število 6?', 'Kemija', 'Bor', 'Ogljik', 'Dušik', 'Kisik', 'B', 10, 12, 'Srednja šola'),
('Kakšna je molska masa vode (H₂O)?', 'Kemija', '16 g/mol', '18 g/mol', '20 g/mol', '22 g/mol', 'B', 11, 13, 'Srednja šola'),
('Kateri tip kemijske vezi nastane med kovinami?', 'Kemija', 'Kovalentna', 'Ionska', 'Kovinska', 'Van der Waalsove sile', 'C', 11, 14, 'Srednja šola'),
('Kakšen je pH nevtralne raztopine?', 'Kemija', '6', '7', '8', '9', 'B', 10, 15, 'Srednja šola'),

-- Advanced Biology
('V katerem delu celice poteka celično dihanje?', 'Biologija', 'Jedro', 'Mitohondrij', 'Endoplazmatski retikulum', 'Golgijev aparat', 'B', 11, 16, 'Srednja šola'),
('Koliko kromosomov ima človek?', 'Biologija', '44', '45', '46', '48', 'C', 10, 17, 'Srednja šola'),
('Kateri encim razgrajuje škrob v slini?', 'Biologija', 'Pepsin', 'Amilaza', 'Lipaza', 'Tripsin', 'B', 11, 18, 'Srednja šola'),
('Katera je osnovna enota dednosti?', 'Biologija', 'Kromosom', 'Gen', 'DNA', 'Alel', 'B', 10, 19, 'Srednja šola'),
('V kateri fazi mitoze se kromosomi postavijo v ekvator celice?', 'Biologija', 'Profaza', 'Metafaza', 'Anafaza', 'Telofaza', 'B', 12, 20, 'Srednja šola'),

-- Continue with more challenging questions for remaining slots (21-100)
('Katera je enačba za valovno enačbo?', 'Fizika', 'v = f·λ', 'E = hf', 'F = ma', 'P = VI', 'A', 11, 21, 'Srednja šola'),
('Kateri je rezultat reakcije 2H₂ + O₂ → ?', 'Kemija', 'H₂O₂', '2H₂O', 'H₄O₂', '2H₂O₂', 'B', 10, 22, 'Srednja šola'),
('Katera je funkcija ribosomov?', 'Biologija', 'Sinteza proteinov', 'Sinteza lipidov', 'Celično dihanje', 'Fotosinteza', 'A', 11, 23, 'Srednja šola'),
('Koliko je cos(60°)?', 'Matematika', '0,5', '0,6', '0,7', '0,8', 'A', 11, 24, 'Srednja šola'),
('Katera je enota za električno kapacitivnost?', 'Fizika', 'Farad', 'Henry', 'Weber', 'Tesla', 'A', 12, 25, 'Srednja šola'),

-- Adding 75 more challenging questions to reach 100 for high school
('Kateri zakon velja za idealne pline?', 'Kemija', 'Boyle-Mariotte zakon', 'Gay-Lussacov zakon', 'Ideal gas law (PV=nRT)', 'Charles-ov zakon', 'C', 11, 26, 'Srednja šola'),
('Katera je osnovna enota živčnega sistema?', 'Biologija', 'Nevron', 'Sinapse', 'Akson', 'Dendrit', 'A', 10, 27, 'Srednja šola'),
('Koliko je tan(45°)?', 'Matematika', '0', '1', '√2', '√3', 'B', 11, 28, 'Srednja šola'),
('Katera sila drži planete v orbiti?', 'Fizika', 'Elektromagnetna', 'Gravitacijska', 'Jedrska', 'Centrifugalna', 'B', 10, 29, 'Srednja šola'),
('Kateri tip RNA prenašajo genetsko informacijo?', 'Biologija', 'mRNA', 'tRNA', 'rRNA', 'miRNA', 'A', 12, 30, 'Srednja šola'),

('Katera je formula za površino krogle?', 'Matematika', '4πr²', '4πr³', 'πr²', '2πr²', 'A', 11, 31, 'Srednja šola'),
('Kateri element ima največ protonov?', 'Kemija', 'Uran', 'Plutonij', 'Oganesson', 'Torij', 'C', 12, 32, 'Srednja šola'),
('Katera je funkcija belih krvnih celic?', 'Biologija', 'Transport kisika', 'Strjevanje krvi', 'Imunska zaščita', 'Transport hranil', 'C', 10, 33, 'Srednja šola'),
('Koliko je logaritem base 10 od 1000?', 'Matematika', '2', '3', '4', '5', 'B', 11, 34, 'Srednja šola'),
('Katera je enota za magnetni pretok?', 'Fizika', 'Tesla', 'Weber', 'Gauss', 'Henry', 'B', 12, 35, 'Srednja šola'),

('Kateri tip hibridizacije ima ogljik v metanu?', 'Kemija', 'sp', 'sp²', 'sp³', 'sp³d', 'C', 12, 36, 'Srednja šola'),
('V kateri organeli poteka fotosinteza?', 'Biologija', 'Mitohondrij', 'Kloroplast', 'Vakuola', 'Golgijev aparat', 'B', 10, 37, 'Srednja šola'),
('Katera je inverzna funkcija y = ln(x)?', 'Matematika', 'y = e^x', 'y = x²', 'y = 1/x', 'y = √x', 'A', 12, 38, 'Srednja šola'),
('Kateri zakon opisuje elektromagnetno indukcijo?', 'Fizika', 'Ohmov zakon', 'Faradayev zakon', 'Lenzov zakon', 'Gauss zakon', 'B', 11, 39, 'Srednja šola'),
('Katera je molekulska formula glukoze?', 'Kemija', 'C₆H₁₂O₆', 'C₅H₁₀O₅', 'C₆H₁₀O₆', 'C₁₂H₂₂O₁₁', 'A', 11, 40, 'Srednja šola'),

('Kateri proces tvori gamete?', 'Biologija', 'Mitoza', 'Mejoza', 'Citokineza', 'Interfaza', 'B', 11, 41, 'Srednja šola'),
('Koliko je druga derivacija funkcije f(x) = x³?', 'Matematika', '3x²', '6x', '6', 'x²', 'B', 12, 42, 'Srednja šola'),
('Katera je enota za električno induktivnost?', 'Fizika', 'Farad', 'Henry', 'Ohm', 'Siemens', 'B', 12, 43, 'Srednja šola'),
('Kateri je glavni produkt fotosinteze?', 'Biologija', 'Kisik', 'Glukoza', 'Ogljikov dioksid', 'Voda', 'B', 10, 44, 'Srednja šola'),
('Katera je oxidacijska stopnja železa v Fe₂O₃?', 'Kemija', '+2', '+3', '+4', '+1', 'B', 11, 45, 'Srednja šola'),

('Koliko je integral ∫1/x dx?', 'Matematika', 'ln|x| + C', '1/x² + C', 'x + C', '-1/x² + C', 'A', 12, 46, 'Srednja šola'),
('Katera sila deluje med nabitimi delci?', 'Fizika', 'Gravitacijska', 'Elektrostatična', 'Magnetna', 'Jedrska', 'B', 11, 47, 'Srednja šola'),
('Kateri encim odpira DNA vijačnico?', 'Biologija', 'DNA polimeraza', 'Helikaza', 'Primaza', 'Ligaza', 'B', 12, 48, 'Srednja šola'),
('Katera je splošna formula alkanов?', 'Kemija', 'CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnHn', 'B', 11, 49, 'Srednja šola'),
('Koliko je vrednost funkcije f(x) = x² - 3x + 2 pri x = 2?', 'Matematika', '0', '1', '2', '-1', 'A', 11, 50, 'Srednja šola'),

-- Adding final 50 questions to reach 100 for high school
('Kateri zakon opisuje obnašanje svetlobe?', 'Fizika', 'Snellov zakon', 'Hookev zakon', 'Ohmov zakon', 'Coulombov zakon', 'A', 11, 51, 'Srednja šola'),
('Katera je funkcija jetra?', 'Biologija', 'Filtriranje krvi', 'Detoksikacija', 'Dihanje', 'Kroženje', 'B', 10, 52, 'Srednja šola'),
('Koliko je rešitev enačbe x² - 5x + 6 = 0?', 'Matematika', 'x = 2, 3', 'x = 1, 6', 'x = -2, -3', 'x = 2, -3', 'A', 11, 53, 'Srednja šola'),
('Katera je SI osnovna enota za količino snovi?', 'Kemija', 'Gram', 'Mol', 'Liter', 'Kilogram', 'B', 10, 54, 'Srednja šola'),
('Kateri del živčevja nadzoruje reflekse?', 'Biologija', 'Veliki možgani', 'Mali možgani', 'Hrbtenjača', 'Hipotalamus', 'C', 11, 55, 'Srednja šola'),
('Koliko je arcsin(1/2)?', 'Matematika', '30°', '45°', '60°', '90°', 'A', 12, 56, 'Srednja šola'),
('Katera je enota za frekvenco?', 'Fizika', 'Hertz', 'Decibel', 'Watt', 'Joule', 'A', 10, 57, 'Srednja šola'),
('Kateri tip kemijske reakcije je 2H₂O₂ → 2H₂O + O₂?', 'Kemija', 'Sinteza', 'Razgradnja', 'Nadomestitev', 'Dviganje', 'B', 11, 58, 'Srednja šola'),
('Kateri hormon uravnava krvni sladkor?', 'Biologija', 'Adrenalin', 'Insulin', 'Tiroksin', 'Kortizol', 'B', 11, 59, 'Srednja šola'),
('Katera je enačba krožnice s središčem v koordinatnem izhodišču?', 'Matematika', 'x² + y² = r²', 'x + y = r', 'xy = r²', 'x² - y² = r²', 'A', 11, 60, 'Srednja šola'),
('Kateri fizikalni pojav opisuje Dopplerjev efekt?', 'Fizika', 'Lom svetlobe', 'Sprememba frekvence', 'Interferenca', 'Polarizacija', 'B', 12, 61, 'Srednja šola'),
('Kateri biomolekul shranjuje genetske informacije?', 'Biologija', 'Protein', 'Lipid', 'DNA', 'Ogljikohidrat', 'C', 10, 62, 'Srednja šola'),
('Koliko je e (Eulerjevo število) približno?', 'Matematika', '2,618', '2,718', '3,141', '1,618', 'B', 12, 63, 'Srednja šola'),
('Katera je oznaka za električno prevodnost?', 'Fizika', 'R', 'G', 'C', 'L', 'B', 11, 64, 'Srednja šola'),
('Kateri element je osnova organskih spojin?', 'Kemija', 'Vodik', 'Kisik', 'Ogljik', 'Dušik', 'C', 10, 65, 'Srednja šola'),
('Katera krvožilna skupina dovaja kri v srce?', 'Biologija', 'Arterije', 'Vene', 'Kapilare', 'Limfatike', 'B', 10, 66, 'Srednja šola'),
('Katera je formula za volumen stožca?', 'Matematika', 'πr²h', '⅓πr²h', '2πrh', '4πr²', 'B', 11, 67, 'Srednja šola'),
('Kateri princip opisuje zakon o ohranjenosti energije?', 'Fizika', 'Prvi termodynamični zakon', 'Drugi termodynamični zakon', 'Bernoullijeva enačba', 'Pascalov zakon', 'A', 11, 68, 'Srednja šola'),
('Katera je elektronska konfiguracija neona?', 'Kemija', '1s² 2s² 2p⁶', '1s² 2s² 2p⁴', '1s² 2s² 2p⁵', '1s² 2s² 2p³', 'A', 11, 69, 'Srednja šola'),
('V katerem procesu se ATP sintetizira iz ADP?', 'Biologija', 'Glikoliza', 'Citratni cikel', 'Elektronski transport', 'Fotosinteza', 'C', 12, 70, 'Srednja šola'),
('Koliko je limita lim(x→∞) 1/x?', 'Matematika', '0', '1', '∞', 'Ne obstaja', 'A', 12, 71, 'Srednja šola'),
('Katera je osnovna enota električne napetosti?', 'Fizika', 'Amper', 'Volt', 'Ohm', 'Watt', 'B', 10, 72, 'Srednja šola'),
('Kateri tip reakcije je neutralizacija?', 'Kemija', 'Kislina + baza', 'Oksidacija', 'Redukcija', 'Hidroliza', 'A', 10, 73, 'Srednja šola'),
('Kateri del ušesa je odgovoren za sluh?', 'Biologija', 'Zunanje uho', 'Srednje uho', 'Notranje uho', 'Bobničnica', 'C', 11, 74, 'Srednja šola'),
('Katera je derivacija funkcije sin(x)?', 'Matematika', 'cos(x)', '-cos(x)', 'sin(x)', '-sin(x)', 'A', 12, 75, 'Srednja šola'),
('Kateri zakon velja za odboj svetlobe?', 'Fizika', 'Vpadni kot = odbojni kot', 'n₁sin θ₁ = n₂sin θ₂', 'E = hf', 'F = ma', 'A', 11, 76, 'Srednja šola'),
('Katera je splošna formula alkohοlov?', 'Kemija', 'CnH2n+1OH', 'CnH2nOH', 'CnH2n-1OH', 'CnHnOH', 'A', 11, 77, 'Srednja šola'),
('Kateri del možganov kontrolira govor?', 'Biologija', 'Brocovo področje', 'Wernickeovo področje', 'Mali možgani', 'Hipokampus', 'A', 12, 78, 'Srednja šola'),
('Koliko je arccos(0)?', 'Matematika', '0°', '30°', '60°', '90°', 'D', 12, 79, 'Srednja šola'),
('Katera je enota za tlak?', 'Fizika', 'Pascal', 'Newton', 'Joule', 'Watt', 'A', 10, 80, 'Srednja šola'),
('Kateri encim razgrajuje laktozo?', 'Biologija', 'Laktaza', 'Maltaza', 'Sukreza', 'Amilaza', 'A', 11, 81, 'Srednja šola'),
('Katera je rešitev enačbe log₂(x) = 3?', 'Matematika', 'x = 6', 'x = 8', 'x = 9', 'x = 12', 'B', 11, 82, 'Srednja šola'),
('Kateri pojav nastane pri interference svetlobe?', 'Fizika', 'Ojačitev in šibitev', 'Polarizacija', 'Disperzija', 'Difrakcija', 'A', 12, 83, 'Srednja šola'),
('Katera je oxidacijska stopnja vodika v H₂O?', 'Kemija', '-1', '+1', '0', '+2', 'B', 11, 84, 'Srednja šola'),
('Kateri tip mišic je srčna mišica?', 'Biologija', 'Skeletna', 'Gladka', 'Srčna', 'Prečnočrtasta', 'C', 10, 85, 'Srednja šola'),
('Katera je formula za geometrično sredino dveh števil a in b?', 'Matematika', '(a+b)/2', '√(ab)', '2ab/(a+b)', 'ab', 'B', 11, 86, 'Srednja šola'),
('Katera je osnovna enota za delo?', 'Fizika', 'Joule', 'Watt', 'Newton', 'Pascal', 'A', 10, 87, 'Srednja šola'),
('Kateri ion povzroča kislost raztopine?', 'Kemija', 'OH⁻', 'H⁺', 'Na⁺', 'Cl⁻', 'B', 10, 88, 'Srednja šola'),
('Kateri proces tvori novo DNA?', 'Biologija', 'Transkripcija', 'Translacija', 'Replikacija', 'Mutacija', 'C', 11, 89, 'Srednja šola'),
('Koliko je integral ∫cos(x) dx?', 'Matematika', 'sin(x) + C', '-sin(x) + C', 'cos(x) + C', '-cos(x) + C', 'A', 12, 90, 'Srednja šola'),
('Kateri zakon opisuje magnetno silo?', 'Fizika', 'F = qvB', 'F = ma', 'F = kQq/r²', 'F = mg', 'A', 12, 91, 'Srednja šola'),
('Katera je molekulska masa ogljikovega dioksida?', 'Kemija', '28 g/mol', '32 g/mol', '44 g/mol', '46 g/mol', 'C', 11, 92, 'Srednja šola'),
('Kateri del ledvic filtrira kri?', 'Biologija', 'Glomeruli', 'Nefron', 'Kanalčki', 'Mehur', 'A', 11, 93, 'Srednja šola'),
('Katera je enačba hiperbole?', 'Matematika', 'x²/a² - y²/b² = 1', 'x²/a² + y²/b² = 1', 'y = k/x', 'x² + y² = r²', 'A', 12, 94, 'Srednja šola'),
('Kateri pojav opisuje popolni odboj svetlobe?', 'Fizika', 'Refrakcija', 'Difuzija', 'Totalna refleksija', 'Absorbcija', 'C', 11, 95, 'Srednja šola'),
('Kateri tip hibridizacije ima ogljik v acetilenu?', 'Kemija', 'sp', 'sp²', 'sp³', 'sp³d', 'A', 12, 96, 'Srednja šola'),
('Kateri del živčnega sistema kontrolira nezavedno dihanje?', 'Biologija', 'Veliki možgani', 'Mali možgani', 'Podaljšana hrbtenjača', 'Hipotalamus', 'C', 11, 97, 'Srednja šola'),
('Koliko je vrednost π (pi) na tri decimalna mesta?', 'Matematika', '3,141', '3,142', '3,143', '3,140', 'B', 10, 98, 'Srednja šola'),
('Katera je enota za električno delo?', 'Fizika', 'Joule', 'kWh', 'Oba odgovora', 'Noben odgovor', 'C', 11, 99, 'Srednja šola'),
('Kateri proces omogoča rastlinam pridobivanje dušika?', 'Biologija', 'Fotosinteza', 'Fiksacija dušika', 'Transpiracija', 'Celično dihanje', 'B', 12, 100, 'Srednja šola');

-- Insert 150 challenging Sports questions
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
-- Football/Soccer Questions
('Katera država je osvojila največ svetovnih prvenstev v nogometu?', 'Šport', 'Argentina', 'Nemčija', 'Brazilija', 'Italija', 'C', 8, 1, 'Sports'),
('Koliko igralcev ima ena ekipa na igrišču med tekmo nogometa?', 'Šport', '10', '11', '12', '13', 'B', 6, 2, 'Sports'),
('Kateri nogometni klub ima največ zmag v Ligi prvakov?', 'Šport', 'Barcelona', 'Real Madrid', 'AC Milan', 'Liverpool', 'B', 8, 3, 'Sports'),
('Kdo je dosegel največ golov na enem svetovnem prvenstvu?', 'Šport', 'Pelé', 'Just Fontaine', 'Gerd Müller', 'Diego Maradona', 'B', 9, 4, 'Sports'),
('V katerem letu je bilo prvo svetovno prvenstvo v nogometu?', 'Šport', '1928', '1930', '1932', '1934', 'B', 8, 5, 'Sports'),

-- Basketball Questions
('Koliko točk vredno je uspešno mete iz polkroga v košarki?', 'Šport', '1', '2', '3', '4', 'C', 6, 6, 'Sports'),
('Katera ekipa je osvojila največ naslovov NBA prvaka?', 'Šport', 'Los Angeles Lakers', 'Boston Celtics', 'Chicago Bulls', 'Golden State Warriors', 'B', 8, 7, 'Sports'),
('Kdo velja za najboljšega košarkarskega igralca vseh časov?', 'Šport', 'LeBron James', 'Kobe Bryant', 'Michael Jordan', 'Magic Johnson', 'C', 8, 8, 'Sports'),
('Koliko minut traja ena četrtina v NBA?', 'Šport', '10', '12', '15', '20', 'B', 7, 9, 'Sports'),
('Katera država je osvojila prvo olimpijsko zlato v košarki?', 'Šport', 'ZDA', 'Argentina', 'Uruguay', 'Sovjetska zveza', 'A', 9, 10, 'Sports'),

-- Tennis Questions
('Koliko grand slam turnirjev se igra letno?', 'Šport', '3', '4', '5', '6', 'B', 7, 11, 'Sports'),
('Kateri igralec je osvojil največ grand slam naslovov?', 'Šport', 'Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Pete Sampras', 'C', 8, 12, 'Sports'),
('Na kateri podlagi se igra Roland Garros?', 'Šport', 'Trava', 'Beton', 'Peščena podlaga', 'Parket', 'C', 7, 13, 'Sports'),
('Koliko setov mora igralec osvojiti, da zmaga na grand slam turnirju (moški)?', 'Šport', '2', '3', '4', '5', 'B', 7, 14, 'Sports'),
('Katera igralka je osvojila največ grand slam naslovov?', 'Šport', 'Serena Williams', 'Steffi Graf', 'Martina Navratilova', 'Margaret Court', 'D', 8, 15, 'Sports'),

-- Olympic Sports
('V katerem mestu so bile prve moderne olimpijske igre?', 'Šport', 'Pariz', 'London', 'Atene', 'Rim', 'C', 8, 16, 'Sports'),
('Koliko krogov ima olimpijski simbol?', 'Šport', '4', '5', '6', '7', 'B', 6, 17, 'Sports'),
('Katera država je gostila največ poletnih olimpijskih iger?', 'Šport', 'ZDA', 'Francija', 'Velika Britanija', 'Nemčija', 'A', 9, 18, 'Sports'),
('Kdo je najhitrejši človek na svetu?', 'Šport', 'Carl Lewis', 'Usain Bolt', 'Maurice Greene', 'Justin Gatlin', 'B', 7, 19, 'Sports'),
('V katerem letu so bile olimpijske igre v Ljubljani?', 'Šport', 'Nikoli', '1984', '1972', '1980', 'A', 8, 20, 'Sports'),

-- Swimming
('Kateri plavalni slog je najhitrejši?', 'Šport', 'Prosto', 'Hrbtno', 'Prsno', 'Delfin', 'A', 7, 21, 'Sports'),
('Koliko dolga je olimpijska plavalna proga?', 'Šport', '25m', '50m', '75m', '100m', 'B', 7, 22, 'Sports'),
('Kdo drži največ svetovnih rekordov v plavanju?', 'Šport', 'Michael Phelps', 'Mark Spitz', 'Katie Ledecky', 'Adam Peaty', 'A', 8, 23, 'Sports'),
('Koliko olimpijskih zlatih medalj ima Michael Phelps?', 'Šport', '20', '23', '25', '28', 'B', 8, 24, 'Sports'),
('V katerem plavajnem slogu se tekmovalci začnejo iz vode?', 'Šport', 'Prosto', 'Hrbtno', 'Prsno', 'Delfin', 'B', 7, 25, 'Sports'),

-- Formula 1
('Kateri dirkač je osvojil največ naslovov svetovnega prvaka F1?', 'Šport', 'Michael Schumacher', 'Lewis Hamilton', 'Ayrton Senna', 'Juan Manuel Fangio', 'B', 8, 26, 'Sports'),
('Na kateri progi se vozi dirka za VN Monaca?', 'Šport', 'Monaco', 'Monte Carlo', 'Montpellier', 'Marseille', 'B', 8, 27, 'Sports'),
('Koliko dirk sestavlja sezono Formule 1?', 'Šport', '20-24', '15-20', '25-30', '10-15', 'A', 8, 28, 'Sports'),
('Katera ekipa je osvojila največ konstruktorskih naslovov?', 'Šport', 'Ferrari', 'McLaren', 'Mercedes', 'Williams', 'A', 9, 29, 'Sports'),
('Katera je najhitrejša proga v Formuli 1?', 'Šport', 'Monza', 'Silverstone', 'Spa-Francorchamps', 'Baku', 'A', 9, 30, 'Sports'),

-- Cycling
('Katera je najprestižnejša kolesarska dirka?', 'Šport', 'Giro d\'Italia', 'Tour de France', 'Vuelta a España', 'Tour de Suisse', 'B', 7, 31, 'Sports'),
('Koliko etap ima običajno Tour de France?', 'Šport', '18', '19', '21', '23', 'C', 8, 32, 'Sports'),
('Kateri kolesar je osvojil največ Tour de France?', 'Šport', 'Lance Armstrong', 'Eddy Merckx', 'Miguel Indurain', 'Jacques Anquetil', 'B', 9, 33, 'Sports'),
('Kakšne barve je majica vodilnega na Tour de France?', 'Šport', 'Rumena', 'Zelena', 'Rdeča', 'Modra', 'A', 6, 34, 'Sports'),
('V katerem mestu se tradicionalno konča Tour de France?', 'Šport', 'Lyon', 'Marseille', 'Pariz', 'Nice', 'C', 7, 35, 'Sports'),

-- Winter Sports
('Kateri šport kombinira tek in streljanje?', 'Šport', 'Biatlon', 'Nordijska kombinacija', 'Smučarski tek', 'Alpsko smučanje', 'A', 7, 36, 'Sports'),
('Koliko skokov izvede tekmovalec na veliki skakalnici?', 'Šport', '1', '2', '3', '4', 'B', 7, 37, 'Sports'),
('Katera država je najboljša v hokeju na ledu?', 'Šport', 'Rusija', 'Kanada', 'ZDA', 'Švedska', 'B', 8, 38, 'Sports'),
('Koliko igralcev ima ena ekipa na ledu v hokeju?', 'Šport', '5', '6', '7', '8', 'B', 6, 39, 'Sports'),
('Kateri slovenski smučar je osvojil olimpijsko zlato?', 'Šport', 'Bojan Križaj', 'Jure Košir', 'Tina Maze', 'Žan Kranjec', 'C', 8, 40, 'Sports'),

-- Athletics
('Koliko metrov je maraton?', 'Šport', '42.195 m', '42.195 km', '40 km', '45 km', 'B', 7, 41, 'Sports'),
('Kateri je svetovni rekord v teku na 100m (moški)?', 'Šport', '9,58s', '9,63s', '9,69s', '9,72s', 'A', 8, 42, 'Sports'),
('Koliko poskusov ima atlet v metu kopja?', 'Šport', '3', '4', '5', '6', 'D', 8, 43, 'Sports'),
('Katera je najvišja ovira v moški disciplini 110m ovire?', 'Šport', '106,7 cm', '108,7 cm', '110,7 cm', '112,7 cm', 'A', 9, 44, 'Sports'),
('Koliko disciplin vsebuje deseteroboj?', 'Šport', '8', '9', '10', '12', 'C', 7, 45, 'Sports'),

-- Golf
('Koliko lukenj ima standardno golf igrišče?', 'Šport', '16', '17', '18', '19', 'C', 6, 46, 'Sports'),
('Kateri je najbolj prestižen golf turnir?', 'Šport', 'US Open', 'British Open', 'Masters', 'PGA Championship', 'C', 8, 47, 'Sports'),
('Kako se imenuje rezultat, ko igralec zabije žogico v lukno z enim udarcem manj od para?', 'Šport', 'Eagle', 'Birdie', 'Bogey', 'Albatros', 'B', 7, 48, 'Sports'),
('Koliko major turnirjev se igra letno v golfu?', 'Šport', '3', '4', '5', '6', 'B', 7, 49, 'Sports'),
('Kateri igralec je osvojil največ major turnirjev?', 'Šport', 'Jack Nicklaus', 'Tiger Woods', 'Arnold Palmer', 'Gary Player', 'A', 8, 50, 'Sports'),

-- Continue with 100 more challenging sports questions
('V katerem letu je bila ustanovljena FIFA?', 'Šport', '1902', '1904', '1906', '1908', 'B', 9, 51, 'Sports'),
('Kateri rekord drži Cristiano Ronaldo?', 'Šport', 'Največ golov na SP', 'Največ golov za reprezentanco', 'Najhitrejši gol', 'Največ podaj', 'B', 8, 52, 'Sports'),
('Koliko časa traja podaljšek v nogometu?', 'Šport', '15 minut', '20 minut', '30 minut', 'Odvisno od sodnika', 'C', 7, 53, 'Sports'),
('Katera država je gostila SP 2018?', 'Šport', 'Brazilija', 'Nemčija', 'Rusija', 'Katar', 'C', 7, 54, 'Sports'),
('Kdo je edini vratar, ki je osvojil Zlato žogo?', 'Šport', 'Gianluigi Buffon', 'Lev Jašin', 'Manuel Neuer', 'Iker Casillas', 'B', 9, 55, 'Sports'),

('Koliko sekund ima ekipa za napad v košarki (shot clock)?', 'Šport', '20', '24', '30', '35', 'B', 7, 56, 'Sports'),
('Kateri igralec je dosegel največ točk v eni NBA tekmi?', 'Šport', 'Kobe Bryant (81)', 'Wilt Chamberlain (100)', 'Michael Jordan (69)', 'David Thompson (73)', 'B', 9, 57, 'Sports'),
('Koliko prostih metov dobi igralec po osebni napaki pri metu za 3?', 'Šport', '1', '2', '3', 'Odvisno', 'C', 7, 58, 'Sports'),
('Katera je najvišja možna ocena na Euroleague tekmi?', 'Šport', 'Ni omejitve', '200', '150', '100', 'A', 8, 59, 'Sports'),
('Kdo je najmlajši MVP v zgodovini NBA?', 'Šport', 'LeBron James', 'Derrick Rose', 'Magic Johnson', 'Kobe Bryant', 'B', 9, 60, 'Sports'),

('Kateri turnir se igra na travi?', 'Šport', 'Roland Garros', 'US Open', 'Wimbledon', 'Australian Open', 'C', 6, 61, 'Sports'),
('Koliko asov je dosegel John Isner v najdaljši tekmi?', 'Šport', '112', '113', '115', '120', 'A', 9, 62, 'Sports'),
('Katera igralka je dominirala v 90ih?', 'Šport', 'Monica Seles', 'Steffi Graf', 'Martina Hingis', 'Arantxa Sanchez', 'B', 8, 63, 'Sports'),
('Koliko tie-breakov je potrebnih za zmago v petem setu?', 'Šport', 'Ni tie-breaka', '1', '2', 'Odvisno od turnirja', 'D', 9, 64, 'Sports'),
('Kdo je bil najmlajši zmagovalec grand slam turnirja?', 'Šport', 'Martina Hingis', 'Monica Seles', 'Steffi Graf', 'Serena Williams', 'A', 9, 65, 'Sports'),

('Koliko let je med poletnimi olimpijskimi igrami?', 'Šport', '2', '3', '4', '5', 'C', 6, 66, 'Sports'),
('Katera država je osvojila največ zlatih medalj na enem OI?', 'Šport', 'ZDA', 'Sovjetska zveza', 'Nemčija', 'Kitajska', 'A', 8, 67, 'Sports'),
('V katerem letu so bile OI v Barceloni?', 'Šport', '1988', '1992', '1996', '2000', 'B', 8, 68, 'Sports'),
('Kateri športnik je osvojil največ olimpijskih medalj?', 'Šport', 'Michael Phelps', 'Larisa Latynina', 'Mark Spitz', 'Carl Lewis', 'A', 8, 69, 'Sports'),
('Koliko disciplin je v modernem peteroboju?', 'Šport', '4', '5', '6', '7', 'B', 7, 70, 'Sports'),

('Kateri stil je prepovedan v olimpijskem plavanju?', 'Šport', 'Podvodni slog', 'Prosto', 'Delfin', 'Vsi so dovoljeni', 'A', 8, 71, 'Sports'),
('Koliko prošč ima standardni bazen?', 'Šport', '6', '8', '10', '12', 'B', 7, 72, 'Sports'),
('Katera država je najuspešnejša v plavanju?', 'Šport', 'ZDA', 'Avstralija', 'Nemčija', 'Kitajska', 'A', 8, 73, 'Sports'),
('Kdo je bila prva ženska pod 50s na 100m prosto?', 'Šport', 'Janet Evans', 'Dara Torres', 'Britta Steffen', 'Sarah Sjöström', 'D', 9, 74, 'Sports'),
('Koliko let mora biti plavalec star za olimpijske igre?', 'Šport', '14', '15', '16', '18', 'C', 8, 75, 'Sports'),

('Katera ekipa ima največ naslovov v Formuli 1?', 'Šport', 'Ferrari', 'Mercedes', 'McLaren', 'Williams', 'A', 8, 76, 'Sports'),
('Koliko točk dobi zmagovalec dirke?', 'Šport', '20', '25', '30', '50', 'B', 7, 77, 'Sports'),
('Katera je najstarejša dirka v F1?', 'Šport', 'British GP', 'Monaco GP', 'French GP', 'Italian GP', 'A', 9, 78, 'Sports'),
('Kdo je najmlajši svetovni prvak v F1?', 'Šport', 'Lewis Hamilton', 'Sebastian Vettel', 'Max Verstappen', 'Fernando Alonso', 'C', 8, 79, 'Sports'),
('Koliko minut traja običajna F1 dirka?', 'Šport', '90', '120', '180', 'Ni omejitve', 'A', 8, 80, 'Sports'),

('Katera je najdaljša etapa na Tour de France?', 'Šport', 'Planinska etapa', 'Kronometer', 'Ravninska etapa', 'Ni standardno', 'D', 8, 81, 'Sports'),
('Kdo je najmlajši zmagovalec Tour de France?', 'Šport', 'Henri Cornet', 'Laurent Fignon', 'Greg LeMond', 'Jan Ullrich', 'A', 9, 82, 'Sports'),
('Koliko kilometrov je dolg Tour de France?', 'Šport', '2500-3000 km', '3000-3500 km', '3500-4000 km', '4000-4500 km', 'C', 8, 83, 'Sports'),
('Katera država je najuspešnejša na Tour de France?', 'Šport', 'Francija', 'Belgija', 'Španija', 'Italija', 'A', 8, 84, 'Sports'),
('Kdo drži rekord v uri vožnje?', 'Šport', 'Bradley Wiggins', 'Filippo Ganna', 'Victor Campenaerts', 'Dan Bigham', 'B', 9, 85, 'Sports'),

('Koliko krogovništa ima biatlon v sprinterski disciplini?', 'Šport', '1', '2', '3', '4', 'B', 8, 86, 'Sports'),
('Katera država je najuspešnejša v biatlonu?', 'Šport', 'Norveška', 'Nemčija', 'Rusija', 'Francija', 'A', 8, 87, 'Sports'),
('Koliko zgrešenih strelov pomeni eno kazensko krožišče?', 'Šport', '1', '2', '1 minuto', 'Odvisno', 'A', 7, 88, 'Sports'),
('Na kolikšni razdalji se streljanje izvaja?', 'Šport', '30m', '40m', '50m', '100m', 'C', 8, 89, 'Sports'),
('Kateri Slovenec je najuspešnejši v biatlonu?', 'Šport', 'Jakov Fak', 'Klemen Bauer', 'Peter Dokl', 'Janez Ožbolt', 'A', 8, 90, 'Sports'),

('Koliko minut ima ena tretjina v hokeju?', 'Šport', '15', '20', '25', '30', 'B', 6, 91, 'Sports'),
('Katera liga je najmočnejša v hokeju?', 'Šport', 'KHL', 'NHL', 'IIHF', 'DEL', 'B', 7, 92, 'Sports'),
('Koliko igralcev lahko ima ekipa na klopi?', 'Šport', '16', '18', '20', '22', 'C', 8, 93, 'Sports'),
('Kdo je dosegel največ golov v NHL?', 'Šport', 'Wayne Gretzky', 'Gordie Howe', 'Jaromir Jagr', 'Mark Messier', 'A', 8, 94, 'Sports'),
('Katera država je zmagala na prvem svetovnem prvenstvu?', 'Šport', 'Kanada', 'ZDA', 'Sovjetska zveza', 'Češkoslovaška', 'A', 9, 95, 'Sports'),

('Kdo drži svetovni rekord v maratonu (moški)?', 'Šport', 'Eliud Kipchoge', 'Kenenisa Bekele', 'Wilson Kipsang', 'Dennis Kimetto', 'A', 8, 96, 'Sports'),
('Koliko ovir je v disciplini 400m ovire?', 'Šport', '8', '9', '10', '12', 'C', 8, 97, 'Sports'),
('Katera je najkrajša olimpijska disciplina v atletiki?', 'Šport', '60m', '100m', '200m', '50m', 'B', 7, 98, 'Sports'),
('Kdo drži rekord v skoku v višino?', 'Šport', 'Javier Sotomayor', 'Mutaz Barshim', 'Ivan Ukhov', 'Bohdan Bondarenko', 'A', 9, 99, 'Sports'),
('Koliko kg tehta kladivo v atletiki (moški)?', 'Šport', '6 kg', '7,26 kg', '8 kg', '10 kg', 'B', 9, 100, 'Sports'),

-- Final 50 sports questions (101-150)
('Kateri turnir je znan kot "Fifth Major" v golfu?', 'Šport', 'WGC Match Play', 'Players Championship', 'Memorial Tournament', 'Arnold Palmer Invitational', 'B', 9, 101, 'Sports'),
('Koliko parov je v Ryder Cup ekipi?', 'Šport', '10', '12', '14', '16', 'B', 8, 102, 'Sports'),
('Kdo je najmlajši zmagovalec Masters Tournament?', 'Šport', 'Tiger Woods', 'Jordan Spieth', 'Rory McIlroy', 'Sergio Garcia', 'A', 9, 103, 'Sports'),
('Katera je najdaljša luknja na Augusta National?', 'Šport', '2. luknja', '5. luknja', '11. luknja', '15. luknja', 'A', 9, 104, 'Sports'),
('Koliko let je med Ryder Cup turnirji?', 'Šport', '1', '2', '3', '4', 'B', 8, 105, 'Sports'),

('Kateri boxer je osvojil naslove v največ kategorijah?', 'Šport', 'Sugar Ray Leonard', 'Manny Pacquiao', 'Oscar De La Hoya', 'Floyd Mayweather', 'B', 9, 106, 'Sports'),
('Koliko rund ima profesionalni boks?', 'Šport', '10', '12', '15', 'Odvisno', 'B', 8, 107, 'Sports'),
('Kdo je "The Greatest" v boksu?', 'Šport', 'Joe Frazier', 'George Foreman', 'Muhammad Ali', 'Sonny Liston', 'C', 7, 108, 'Sports'),
('Katera je najlažja kategorija v profesionalnem boksu?', 'Šport', 'Minimumweight', 'Light flyweight', 'Flyweight', 'Super flyweight', 'A', 9, 109, 'Sports'),
('Koliko minut traja ena runda v boksu?', 'Šport', '2', '3', '4', '5', 'B', 7, 110, 'Sports'),

('Kateri rekord drži Novak Djokovic?', 'Šport', 'Največ Grand Slamov', 'Največ tednov št. 1', 'Najhitrejši servis', 'Največ ATP turnirjev', 'B', 8, 111, 'Sports'),
('Koliko let je bil najstarejši zmagovalec Grand Slam turnirja?', 'Šport', '35', '37', '39', '41', 'B', 9, 112, 'Sports'),
('Katera je edina podlaga, na kateri Novak Djokovic ni osvojil Grand Slam?', 'Šport', 'Vse je osvojil', 'Trava', 'Peščena podlaga', 'Beton', 'A', 8, 113, 'Sports'),
('Kdo je osvojil Calendar Grand Slam v moški konkurenci?', 'Šport', 'Rod Laver', 'Don Budge', 'Oba odgovora', 'Nihče', 'C', 9, 114, 'Sports'),
('Koliko je najdaljša tekma v zgodovini tenisa?', 'Šport', '8 ur', '11 ur', '14 ur', '18 ur', 'B', 9, 115, 'Sports'),

('Katere barve so olimpijski krogi?', 'Šport', 'Modra, črna, rdeča, rumena, zelena', 'Modra, črna, rdeča, oranžna, vijolična', 'Modra, rjava, rdeča, rumena, zelena', 'Modra, črna, roza, rumena, zelena', 'A', 7, 116, 'Sports'),
('V katerem mestu bo OI 2028?', 'Šport', 'Pariz', 'Los Angeles', 'Brisbane', 'Milano', 'B', 7, 117, 'Sports'),
('Katera država je gostila zimske OI 2022?', 'Šport', 'Južna Koreja', 'Kitajska', 'Japonska', 'Rusija', 'B', 7, 118, 'Sports'),
('Koliko disciplin je bilo na prvih modernih OI?', 'Šport', '41', '43', '45', '47', 'B', 9, 119, 'Sports'),
('Kdo je bil najstarejši olimpijski prvak?', 'Šport', 'Oscar Swahn', 'Aladar Gerevich', 'Hiroshi Hoketsu', 'John Copley', 'A', 9, 120, 'Sports'),

('Kateri slog uporablja najmanj energije?', 'Šport', 'Prosto', 'Hrbtno', 'Prsno', 'Delfin', 'C', 8, 121, 'Sports'),
('Koliko je svetovne rekord na 1500m prosto (moški)?', 'Šport', '14:31', '14:41', '14:51', '15:01', 'A', 9, 122, 'Sports'),
('Katera država je najuspešnejša v sinhronem plavanju?', 'Šport', 'ZDA', 'Rusija', 'Kitajska', 'Španija', 'B', 8, 123, 'Sports'),
('Kdo je prvi človek pod 21s na 50m prosto?', 'Šport', 'Cesar Cielo', 'Caeleb Dressel', 'Nathan Adrian', 'Bruno Fratus', 'A', 9, 124, 'Sports'),
('Koliko metrov je najkrajša olimpijska razdalja v plavanju?', 'Šport', '50m', '100m', '200m', '400m', 'A', 7, 125, 'Sports'),

('Katera je najhitrejša disciplina v atletiki?', 'Šport', '100m', '200m', '400m', '110m ovire', 'A', 7, 126, 'Sports'),
('Kdo drži rekord v palici (moški)?', 'Šport', 'Armand Duplantis', 'Renaud Lavillenie', 'Sergey Bubka', 'Sam Kendricks', 'A', 8, 127, 'Sports'),
('Koliko korakov naj bi bil ritem v štafeti 4x100m?', 'Šport', '15-17', '17-19', '19-21', '21-23', 'B', 9, 128, 'Sports'),
('Katera je najdaljša olimpijska disciplina v atletiki?', 'Šport', 'Maraton', '50km hoja', '20km hoja', '10000m', 'B', 8, 129, 'Sports'),
('Kdo drži rekord v desetem boju?', 'Šport', 'Kevin Mayer', 'Ashton Eaton', 'Roman Šebrle', 'Daley Thompson', 'A', 9, 130, 'Sports'),

('Kateri voznik je imel največ zmag v eni sezoni F1?', 'Šport', 'Michael Schumacher', 'Sebastian Vettel', 'Max Verstappen', 'Lewis Hamilton', 'C', 8, 131, 'Sports'),
('Koliko sekund mora biti pit stop dolg?', 'Šport', '2-3 sekunde', '3-4 sekunde', 'Ni omejitve', '1-2 sekundi', 'C', 8, 132, 'Sports'),
('Katera je največ točk, ki jih lahko dosiže voznik na dirki?', 'Šport', '25', '26', '29', '30', 'B', 8, 133, 'Sports'),
('Kdo je imel najdaljšo kariero v F1?', 'Šport', 'Rubens Barrichello', 'Fernando Alonso', 'Kimi Raikkonen', 'Jenson Button', 'A', 9, 134, 'Sports'),
('Koliko gramov goriva lahko porabi F1 dirkalnik na dirki?', 'Šport', '100 kg', '110 kg', '120 kg', '130 kg', 'B', 9, 135, 'Sports'),

('Kateri kolesar je osvojil vsa tri Grand Toure v eni sezoni?', 'Šport', 'Eddy Merckx', 'Chris Froome', 'Alberto Contador', 'Nihče', 'D', 9, 136, 'Sports'),
('Koliko točk je vreden vrhunec v klasifikaciji hribovcev?', 'Šport', '25', '20', '10', 'Odvisno od kategorije', 'D', 8, 137, 'Sports'),
('Kateri je najhitrejši povprečna hitrost na Tour de France?', 'Šport', '40 km/h', '42 km/h', '44 km/h', '46 km/h', 'C', 9, 138, 'Sports'),
('Kdo je najstarejši zmagovalec etape na Tour de France?', 'Šport', 'Chris Horner', 'Alejandro Valverde', 'Jens Voigt', 'George Hincapie', 'A', 9, 139, 'Sports'),
('Koliko etap je najdaljši Tour de France?', 'Šport', '24', '25', '26', '27', 'B', 9, 140, 'Sports'),

-- Final 10 sports questions (141-150)
('Kateri šport ima največjo gledanost na televiziji?', 'Šport', 'Nogomet', 'Ameriški nogomet', 'Košarka', 'Formula 1', 'A', 8, 141, 'Sports'),
('Koliko športov je bilo na olimpijskih igrah 2020?', 'Šport', '32', '33', '34', '35', 'B', 8, 142, 'Sports'),
('Katera je najstarejša profesionalna športna liga?', 'Šport', 'MLB', 'NFL', 'NHL', 'NBA', 'A', 9, 143, 'Sports'),
('Kdo je osvojil največ medalj na enih zimskih OI?', 'Šport', 'Ole Einar Bjørndalen', 'Marit Bjørgen', 'Johannes Thingnes Bø', 'Björn Dählie', 'B', 9, 144, 'Sports'),
('Kateri šport ima največ udeležencev po svetu?', 'Šport', 'Nogomet', 'Košarka', 'Plavanje', 'Atletika', 'A', 7, 145, 'Sports'),
('V katerem letu bo svetovno prvenstvo v nogometu v ZDA?', 'Šport', '2026', '2028', '2030', '2032', 'A', 8, 146, 'Sports'),
('Kateri je najdragespeči šport za igranje?', 'Šport', 'Golf', 'Polo', 'Formula 1', 'Jahanje', 'C', 8, 147, 'Sports'),
('Koliko držav sodeluje na olimpijskih igrah?', 'Šport', '190-200', '200-210', '210-220', '220-230', 'B', 8, 148, 'Sports'),
('Kateri je najhitrejši rastoci šport?', 'Šport', 'Padel', 'E-šport', 'Pickleball', 'CrossFit', 'C', 8, 149, 'Sports'),
('Katera država bo gostila zimske OI 2026?', 'Šport', 'Švica', 'Italija', 'Francija', 'Avstrija', 'B', 7, 150, 'Sports');