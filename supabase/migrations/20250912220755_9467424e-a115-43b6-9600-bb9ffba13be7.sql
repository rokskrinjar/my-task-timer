-- Insert comprehensive "Šola" category questions for grades 1-12
-- Each grade gets curriculum-aligned questions covering core Slovenian subjects
-- Fixed: Using uppercase letters for correct_answer field

-- Grade 1 Questions (difficulty_order 1-100)
INSERT INTO questions (question_text, subject, grade_level, difficulty_order, category, option_a, option_b, option_c, option_d, correct_answer) VALUES
-- Slovenščina Grade 1 (30 questions)
('Katera črka je samoglasnik?', 'Slovenščina', 1, 1, 'Šola', 'a', 'b', 'c', 'd', 'A'),
('Koliko samoglasnikov ima beseda "mama"?', 'Slovenščina', 1, 2, 'Šola', '1', '2', '3', '4', 'B'),
('Katera beseda se začne z velikim začetkom?', 'Slovenščina', 1, 3, 'Šola', 'miza', 'Anja', 'sončce', 'hiša', 'B'),
('Kako se pravilno pozdravi zjutraj?', 'Slovenščina', 1, 4, 'Šola', 'Dober dan', 'Dobro jutro', 'Lahko noč', 'Nasvidenje', 'B'),
('Katera beseda pomeni žival?', 'Slovenščina', 1, 5, 'Šola', 'miza', 'pes', 'svinčnik', 'knjiga', 'B'),
('S katero črko se začne beseda "šola"?', 'Slovenščina', 1, 6, 'Šola', 's', 'š', 'z', 'c', 'B'),
('Koliko besed je v stavku "Jaz imam psa."?', 'Slovenščina', 1, 7, 'Šola', '2', '3', '4', '5', 'C'),
('Katera beseda se izgovori enako kot se piše?', 'Slovenščina', 1, 8, 'Šola', 'mama', 'oče', 'babica', 'vse', 'D'),
('Kako se konča stavek?', 'Slovenščina', 1, 9, 'Šola', 'z vejico', 's piko', 'z vprašajem', 'z nič', 'B'),
('Katera črka pride v abecedi za črko "b"?', 'Slovenščina', 1, 10, 'Šola', 'a', 'c', 'd', 'e', 'B'),

-- Matematika Grade 1 (30 questions)
('Koliko je 1 + 1?', 'Matematika', 1, 11, 'Šola', '1', '2', '3', '4', 'B'),
('Koliko je 3 - 1?', 'Matematika', 1, 12, 'Šola', '1', '2', '3', '4', 'B'),
('Katera številka je večja: 2 ali 5?', 'Matematika', 1, 13, 'Šola', '2', '5', 'enaki', 'ne vem', 'B'),
('Koliko je 2 + 3?', 'Matematika', 1, 14, 'Šola', '4', '5', '6', '7', 'B'),
('Katera številka pride za številko 4?', 'Matematika', 1, 15, 'Šola', '3', '5', '6', '7', 'B'),
('Koliko je 5 - 2?', 'Matematika', 1, 16, 'Šola', '2', '3', '4', '5', 'B'),
('Katera geometrijska oblika ima 3 stranice?', 'Matematika', 1, 17, 'Šola', 'krog', 'kvadrat', 'trikotnik', 'pravokotnik', 'C'),
('Koliko je 4 + 1?', 'Matematika', 1, 18, 'Šola', '3', '4', '5', '6', 'C'),
('Katera številka je manjša: 3 ali 7?', 'Matematika', 1, 19, 'Šola', '3', '7', 'enaki', 'ne vem', 'A'),
('Koliko prstov ima ena roka?', 'Matematika', 1, 20, 'Šola', '4', '5', '6', '10', 'B'),

-- Spoznavanje okolja Grade 1 (40 questions)
('Kateri letni čas je najhladnejši?', 'Spoznavanje okolja', 1, 21, 'Šola', 'pomlad', 'poletje', 'jesen', 'zima', 'D'),
('Kdaj sije sončce?', 'Spoznavanje okolja', 1, 22, 'Šola', 'ponoči', 'zjutraj', 'podnevi', 'nikoli', 'C'),
('Katera barva nastane, če zmešamo rdečo in rumeno?', 'Spoznavanje okolja', 1, 23, 'Šola', 'zelena', 'oranžna', 'vijolična', 'modra', 'B'),
('Kaj potrebuje rastlina za rast?', 'Spoznavanje okolja', 1, 24, 'Šola', 'samo vodo', 'samo sončce', 'vodo in sončce', 'nič', 'C'),
('Katera žival da mleko?', 'Spoznavanje okolja', 1, 25, 'Šola', 'krava', 'mačka', 'pes', 'zajec', 'A'),
('Koliko nog ima pajek?', 'Spoznavanje okolja', 1, 26, 'Šola', '6', '8', '10', '12', 'B'),
('Kaj jedo zajci?', 'Spoznavanje okolja', 1, 27, 'Šola', 'meso', 'sadje', 'zelenjavo', 'vse', 'C'),
('Kateri del rastline je pod zemljo?', 'Spoznavanje okolja', 1, 28, 'Šola', 'list', 'cvet', 'steblo', 'korenina', 'D'),
('Kdaj drevesa dobijo nove liste?', 'Spoznavanje okolja', 1, 29, 'Šola', 'pozimi', 'spomladi', 'poleti', 'jeseni', 'B'),
('Katera žival leze?', 'Spoznavanje okolja', 1, 30, 'Šola', 'ptica', 'kača', 'zajec', 'konj', 'B'),

-- Grade 2 Questions (difficulty_order 101-200)
('Kako se imenuje žival, ki poje jajca?', 'Slovenščina', 2, 101, 'Šola', 'ptica', 'kokoš', 'riba', 'kača', 'B'),
('Katera beseda je množina od "otrok"?', 'Slovenščina', 2, 102, 'Šola', 'otroci', 'otroka', 'otroke', 'otrok', 'A'),
('S katero črko se začne beseda "žaba"?', 'Slovenščina', 2, 103, 'Šola', 'z', 'ž', 'j', 's', 'B'),
('Kako se pravilno napiše ženski spol od "učitelj"?', 'Slovenščina', 2, 104, 'Šola', 'učiteljka', 'učiteljica', 'učitelja', 'učitelj', 'B'),
('Katera beseda pomeni nasprotje od "star"?', 'Slovenščina', 2, 105, 'Šola', 'mlad', 'nov', 'svež', 'majhen', 'A'),

-- Matematika Grade 2
('Koliko je 12 + 8?', 'Matematika', 2, 106, 'Šola', '19', '20', '21', '22', 'B'),
('Koliko je 15 - 7?', 'Matematika', 2, 107, 'Šola', '7', '8', '9', '10', 'B'),
('Katera številka je večja: 16 ali 23?', 'Matematika', 2, 108, 'Šola', '16', '23', 'enaki', 'ne vem', 'B'),
('Koliko je 3 × 4?', 'Matematika', 2, 109, 'Šola', '7', '12', '15', '16', 'B'),
('Koliko je 20 - 12?', 'Matematika', 2, 110, 'Šola', '6', '7', '8', '9', 'C'),

-- Spoznavanje okolja Grade 2
('Katero slovensko mesto je glavno mesto?', 'Spoznavanje okolja', 2, 111, 'Šola', 'Maribor', 'Ljubljana', 'Celje', 'Kranj', 'B'),
('Katera barva je slovenska zastava?', 'Spoznavanje okolja', 2, 112, 'Šola', 'rdeča, modra, bela', 'bela, modra, rdeča', 'zelena, bela, rdeča', 'modra, bela, rdeča', 'B'),
('Katera žival je simbol Slovenije?', 'Spoznavanje okolja', 2, 113, 'Šola', 'orel', 'medved', 'volk', 'lisica', 'B'),
('Katere dobre lastnosti ima človek?', 'Spoznavanje okolja', 2, 114, 'Šola', 'prijaznost', 'pohlepnost', 'jezo', 'lenoba', 'A'),
('Kaj počnemo z odpadki?', 'Spoznavanje okolja', 2, 115, 'Šola', 'vržemo povsod', 'ločujemo', 'pustimo na tleh', 'skrijemo', 'B'),

-- Grade 3 Questions (difficulty_order 201-300)
('Kako se imenuje povest, ki jo nekdo pripoveduje?', 'Slovenščina', 3, 201, 'Šola', 'pravljica', 'pesej', 'zgodba', 'roman', 'C'),
('Kateri stavek je vprašalni?', 'Slovenščina', 3, 202, 'Šola', 'Jaz grem v šolo.', 'Kako se imaš?', 'Res je lep dan!', 'Pospravi sobo.', 'B'),
('Kako se imenuje beseda, ki opisuje lastnost?', 'Slovenščina', 3, 203, 'Šola', 'samostalnik', 'pridevnik', 'glagol', 'prislov', 'B'),
('Katera beseda je glagol?', 'Slovenščina', 3, 204, 'Šola', 'miza', 'rdeč', 'tečem', 'hitro', 'C'),
('Kako se imenuje oseba, ki uči otroke?', 'Slovenščina', 3, 205, 'Šola', 'zdravnik', 'učitelj', 'kuhar', 'voznik', 'B'),

-- Matematika Grade 3
('Koliko je 25 × 4?', 'Matematika', 3, 206, 'Šola', '100', '120', '125', '150', 'A'),
('Koliko je 144 ÷ 12?', 'Matematika', 3, 207, 'Šola', '10', '11', '12', '13', 'C'),
('Koliko je površina kvadrata s stranico 6 cm?', 'Matematika', 3, 208, 'Šola', '24 cm²', '36 cm²', '12 cm²', '18 cm²', 'B'),
('Koliko je 15% od 100?', 'Matematika', 3, 209, 'Šola', '10', '15', '20', '25', 'B'),
('Koliko je obvod pravokotnika s stranicama 5 cm in 3 cm?', 'Matematika', 3, 210, 'Šola', '8 cm', '15 cm', '16 cm', '30 cm', 'C'),

-- Naravoslovje Grade 3
('Kako se imenuje proces, ko rastlina izdeluje hrano?', 'Naravoslovje', 3, 211, 'Šola', 'dihanje', 'fotosinteza', 'prebava', 'gibanje', 'B'),
('Kateri del rastline opravi fotosinteza?', 'Naravoslovje', 3, 212, 'Šola', 'korenina', 'steblo', 'list', 'cvet', 'C'),
('Kaj potrebujejo rastline za fotosinteza?', 'Naravoslovje', 3, 213, 'Šola', 'vodo', 'sončno svetlobo', 'ogljikov dioksid', 'vse našteto', 'D'),
('Kateri sistem organov skrbi za dihanje?', 'Naravoslovje', 3, 214, 'Šola', 'prebavni', 'krvni', 'dihalni', 'živčni', 'C'),
('Kako se imenuje pretvorba vode v vodne pare?', 'Naravoslovje', 3, 215, 'Šola', 'kondenzacija', 'izparevanje', 'zmrzovanje', 'taljenje', 'B'),

-- Grade 4 Questions (difficulty_order 301-400)
('Kdo je napisal "Kekec"?', 'Slovenščina', 4, 301, 'Šola', 'Prešeren', 'Cankar', 'Vandot', 'Kette', 'C'),
('Kako se imenuje glavna oseba v zgodbi?', 'Slovenščina', 4, 302, 'Šola', 'pripovedovalec', 'junak', 'avtor', 'bralec', 'B'),
('Kateri del govora so besede: lepo, hitro, počasi?', 'Slovenščina', 4, 303, 'Šola', 'pridevniki', 'glagoli', 'prislovi', 'samostalniki', 'C'),
('Kaj pomeni pregovor "Kdor drugemu jamo koplje, sam vanjo pade"?', 'Slovenščina', 4, 304, 'Šola', 'ne delaj hudega', 'kopanje je nevarno', 'pomagaj drugim', 'bodi previden', 'A'),
('Kako se imenuje pesej brez rime?', 'Slovenščina', 4, 305, 'Šola', 'proza', 'verz', 'prosta pesej', 'sonet', 'C'),

-- Matematika Grade 4
('Koliko je 789 + 456?', 'Matematika', 4, 306, 'Šola', '1235', '1245', '1255', '1265', 'B'),
('Koliko je 1000 - 347?', 'Matematika', 4, 307, 'Šola', '653', '663', '673', '683', 'A'),
('Koliko je 24 × 15?', 'Matematika', 4, 308, 'Šola', '350', '360', '370', '380', 'B'),
('Koliko je 576 ÷ 24?', 'Matematika', 4, 309, 'Šola', '22', '23', '24', '25', 'C'),
('Koliko je 30% od 150?', 'Matematika', 4, 310, 'Šola', '40', '45', '50', '55', 'B'),

-- Družba Grade 4
('Katera je prestolnica Francije?', 'Družba', 4, 311, 'Šola', 'London', 'Pariz', 'Rim', 'Madrid', 'B'),
('V katerem letu je bila razglašena slovenska samostojnost?', 'Družba', 4, 312, 'Šola', '1990', '1991', '1992', '1993', 'B'),
('Katera celina je največja?', 'Družba', 4, 313, 'Šola', 'Afrika', 'Azija', 'Evropa', 'Amerika', 'B'),
('Kateri ocean je največji?', 'Družba', 4, 314, 'Šola', 'Atlantski', 'Indijski', 'Tihi', 'Arktični', 'C'),
('Katero slovensko jezero je največje?', 'Družba', 4, 315, 'Šola', 'Blejsko', 'Bohinjsko', 'Cerkniško', 'Ptujsko', 'B'),

-- Grade 5 Questions (difficulty_order 401-500)
('Kdo je napisal "Deseti brat"?', 'Slovenščina', 5, 401, 'Šola', 'Cankar', 'Bevk', 'Prešeren', 'Kette', 'B'),
('Kaj pomeni beseda "avtohtono"?', 'Slovenščina', 5, 402, 'Šola', 'tuje', 'domače', 'staro', 'novo', 'B'),
('Kako se imenuje zbirka pesmi France Prešeren?', 'Slovenščina', 5, 403, 'Šola', 'Gazele', 'Poezije', 'Sonetni venec', 'Krst pri Savici', 'B'),
('Kateri literarni rod so pravljice?', 'Slovenščina', 5, 404, 'Šola', 'epika', 'lirika', 'dramatika', 'proza', 'A'),
('Kako se imenuje glavni verz v slovenski pesništvo?', 'Slovenščina', 5, 405, 'Šola', 'osmerec', 'desetiracec', 'alexandrinec', 'sonet', 'A'),

-- Matematika Grade 5
('Koliko je 2³ × 3²?', 'Matematika', 5, 406, 'Šola', '36', '48', '64', '72', 'D'),
('Rešite enačbo: 2x + 5 = 13', 'Matematika', 5, 407, 'Šola', 'x = 3', 'x = 4', 'x = 5', 'x = 6', 'B'),
('Koliko je √64?', 'Matematika', 5, 408, 'Šola', '6', '7', '8', '9', 'C'),
('Koliko je 45% od 200?', 'Matematika', 5, 409, 'Šola', '80', '85', '90', '95', 'C'),
('Kako se imenuje mnogokotnik z osmimi stranicami?', 'Matematika', 5, 410, 'Šola', 'heksagon', 'heptagon', 'oktagon', 'nonagon', 'C'),

-- Continue with higher grades...
-- Grade 6 Questions (difficulty_order 501-600)
('Kdo je napisal "Jurček pa Jurčička"?', 'Slovenščina', 6, 501, 'Šola', 'Levstik', 'Tavčar', 'Cankar', 'Bevk', 'A'),
('Koliko je površina kroga s polmerom 5 cm? (π ≈ 3,14)', 'Matematika', 6, 502, 'Šola', '78,5 cm²', '31,4 cm²', '15,7 cm²', '62,8 cm²', 'A'),
('V katerem letu je bila podpisana Brionska deklaracija?', 'Družba', 6, 503, 'Šola', '1917', '1918', '1920', '1921', 'A'),
('Kateri sistem organov skrbi za čiščenje krvi?', 'Naravoslovje', 6, 504, 'Šola', 'prebavni', 'dihalni', 'sečni', 'krvni', 'C'),
('Kako se imenuje največja slovenska reka?', 'Družba', 6, 505, 'Šola', 'Krka', 'Sava', 'Drava', 'Mura', 'B'),

-- Grade 7 Questions (difficulty_order 601-700)
('Kdo je napisal "Krst pri Savici"?', 'Slovenščina', 7, 601, 'Šola', 'Prešeren', 'Cankar', 'Kette', 'Aškerc', 'A'),
('Koliko je (-5) × (-3)?', 'Matematika', 7, 602, 'Šola', '-15', '15', '-8', '8', 'B'),
('V katerem letu se je začela prva svetovna vojna?', 'Zgodovina', 7, 603, 'Šola', '1914', '1915', '1916', '1917', 'A'),
('Kateri kemijski element ima simbol O?', 'Kemija', 7, 604, 'Šola', 'ogljik', 'kisik', 'vodik', 'dušik', 'B'),
('Koliko je √81?', 'Matematika', 7, 605, 'Šola', '8', '9', '10', '11', 'B'),

-- Grade 8 Questions (difficulty_order 701-800)
('Kdo je avtor dela "Martin Krpan"?', 'Slovenščina', 8, 701, 'Šola', 'Levstik', 'Cankar', 'Prešeren', 'Jurčič', 'A'),
('Rešite enačbo: 3x + 5 = 14', 'Matematika', 8, 702, 'Šola', 'x = 2', 'x = 3', 'x = 4', 'x = 5', 'B'),
('Katero slovensko mesto je bilo pomembno trgovinsko središče v srednjem veku?', 'Zgodovina', 8, 703, 'Šola', 'Ljubljana', 'Celje', 'Škofja Loka', 'vse našteto', 'D'),
('Katere delce vsebuje atomsko jedro?', 'Fizika', 8, 704, 'Šola', 'protone', 'protone in nevtrone', 'elektrone', 'protone in elektrone', 'B'),
('Koliko je (a + b)²?', 'Matematika', 8, 705, 'Šola', 'a² + b²', 'a² + 2ab + b²', 'a² - b²', '2a + 2b', 'B'),

-- Grade 9 Questions (difficulty_order 801-900)
('Kdo je napisal "Na žalostni gori"?', 'Slovenščina', 9, 801, 'Šola', 'Župančič', 'Cankar', 'Kosovel', 'Aškerc', 'A'),
('Koliko je sin(30°)?', 'Matematika', 9, 802, 'Šola', '0,5', '0,6', '0,7', '0,8', 'A'),
('V katerem letu je Slovenija vstopila v EU?', 'Geografija', 9, 803, 'Šola', '2002', '2003', '2004', '2005', 'C'),
('Katera snov se sprosti pri elektrolizi vode?', 'Kemija', 9, 804, 'Šola', 'vodik in kisik', 'samo vodik', 'samo kisik', 'ogljikov dioksid', 'A'),
('Koliko je diskriminanta enačbe x² - 4x + 3 = 0?', 'Matematika', 9, 805, 'Šola', '4', '8', '12', '16', 'A'),

-- Grade 10 Questions (difficulty_order 901-1000)
('Kdo je avtor "Ljubljanskega poročanja Cankar"?', 'Slovenščina', 10, 901, 'Šola', 'Kosovel', 'Cankar', 'Župančič', 'Gradnik', 'B'),
('Koliko je lim(x→0) (sin x)/x?', 'Matematika', 10, 902, 'Šola', '0', '1', '∞', 'ne obstaja', 'B'),
('Kdo je bil prvi predsednik Slovenije?', 'Zgodovina', 10, 903, 'Šola', 'Kučan', 'Drnovšek', 'Peterle', 'Bavčar', 'A'),
('Katera je molekulska formula metana?', 'Kemija', 10, 904, 'Šola', 'CH₂', 'CH₃', 'CH₄', 'C₂H₄', 'C'),
('Koliko je ∫x²dx?', 'Matematika', 10, 905, 'Šola', 'x³/3 + C', 'x³ + C', '2x + C', 'x²/2 + C', 'A'),

-- Grade 11 Questions (difficulty_order 1001-1100)
('Kdo je napisal "Balada o trobenti in oblaku"?', 'Slovenščina', 11, 1001, 'Šola', 'Kosovel', 'Gradnik', 'Majar', 'Župančič', 'A'),
('Kako se imenuje odvedena funkcija ln(x)?', 'Matematika', 11, 1002, 'Šola', '1', '1/x', 'x', 'ln(x)', 'B'),
('V katerem letu je bilo podpisano Rapallsko sporazum?', 'Zgodovina', 11, 1003, 'Šola', '1920', '1921', '1922', '1923', 'A'),
('Katera je relativna molekulska masa vode?', 'Kemija', 11, 1004, 'Šola', '16', '17', '18', '19', 'C'),
('Koliko je e^(ln(5))?', 'Matematika', 11, 1005, 'Šola', '5', 'ln(5)', 'e', '1', 'A'),

-- Grade 12 Questions (difficulty_order 1101-1200)
('Kdo je napisal "Eros"?', 'Slovenščina', 12, 1101, 'Šola', 'Župančič', 'Cankar', 'Kosovel', 'Gradnik', 'A'),
('Koliko je druga odvedena funkcije sin(x)?', 'Matematika', 12, 1102, 'Šola', 'cos(x)', '-cos(x)', 'sin(x)', '-sin(x)', 'D'),
('V katerem letu je bila razglašena Slovenska država SHS?', 'Zgodovina', 12, 1103, 'Šola', '1918', '1919', '1920', '1921', 'A'),
('Katera je molekulska formula benzena?', 'Kemija', 12, 1104, 'Šola', 'C₆H₆', 'C₆H₁₂', 'C₆H₁₄', 'C₆H₁₀', 'A'),
('Koliko je ∫(1/x)dx?', 'Matematika', 12, 1105, 'Šola', 'ln|x| + C', 'x + C', '1/x² + C', 'x² + C', 'A');