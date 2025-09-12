-- Step 1: Update existing categories to "Šola"
UPDATE questions 
SET category = 'Šola' 
WHERE category IN ('Osnovna šola', 'Srednja šola');

-- Step 2: Insert questions for grades 1-5
INSERT INTO questions (question_text, subject, grade_level, difficulty_order, option_a, option_b, option_c, option_d, correct_answer, category) VALUES
-- Grade 1 Questions (difficulty_order 1-10)
('Koliko je 2 + 3?', 'Matematika', 1, 1, '4', '5', '6', '7', 'B', 'Šola'),
('Katera črka pride za A?', 'Slovenščina', 1, 2, 'B', 'C', 'D', 'E', 'A', 'Šola'),
('Koliko nog ima mačka?', 'Naravoslovje', 1, 3, '2', '4', '6', '8', 'B', 'Šola'),
('Katere barve je sonce?', 'Naravoslovje', 1, 4, 'Modre', 'Rdeče', 'Rumene', 'Zelene', 'C', 'Šola'),
('Koliko je 5 - 2?', 'Matematika', 1, 5, '2', '3', '4', '5', 'B', 'Šola'),
('Kako se imenuje naša država?', 'Družba', 1, 6, 'Hrvaška', 'Slovenija', 'Italija', 'Avstrija', 'B', 'Šola'),
('Koliko prstov ima ena roka?', 'Matematika', 1, 7, '4', '5', '6', '10', 'B', 'Šola'),
('Kateri žival pravi "miau"?', 'Naravoslovje', 1, 8, 'Pes', 'Mačka', 'Krava', 'Prašič', 'B', 'Šola'),
('Koliko je 1 + 1?', 'Matematika', 1, 9, '1', '2', '3', '4', 'B', 'Šola'),
('Katero letno obdobje pride po zimi?', 'Naravoslovje', 1, 10, 'Poletje', 'Jesen', 'Pomlad', 'Zima', 'C', 'Šola'),

-- Grade 2 Questions (difficulty_order 11-20)
('Koliko je 7 + 5?', 'Matematika', 2, 11, '11', '12', '13', '14', 'B', 'Šola'),
('Koliko slogov ima beseda "mama"?', 'Slovenščina', 2, 12, '1', '2', '3', '4', 'B', 'Šola'),
('Katera rastlina potrebuje vodo za rast?', 'Naravoslovje', 2, 13, 'Samo roža', 'Samo drevo', 'Vse rastline', 'Nobena', 'C', 'Šola'),
('Koliko je 20 - 8?', 'Matematika', 2, 14, '10', '11', '12', '13', 'C', 'Šola'),
('Kateri dan pride po ponedeljku?', 'Družba', 2, 15, 'Sreda', 'Torek', 'Četrtek', 'Petek', 'B', 'Šola'),
('Koliko koles ima kolo?', 'Matematika', 2, 16, '1', '2', '3', '4', 'B', 'Šola'),
('Kam spadajo zobje?', 'Naravoslovje', 2, 17, 'V noge', 'V roke', 'V usta', 'V oči', 'C', 'Šola'),
('Koliko je 6 + 6?', 'Matematika', 2, 18, '10', '11', '12', '13', 'C', 'Šola'),
('Katera barva nastane, če pomešamo rdečo in rumeno?', 'Likovna', 2, 19, 'Zelena', 'Modra', 'Oranžna', 'Vijolična', 'C', 'Šola'),
('Koliko mesecev ima leto?', 'Družba', 2, 20, '10', '11', '12', '13', 'C', 'Šola'),

-- Grade 3 Questions (difficulty_order 21-30)
('Koliko je 8 × 3?', 'Matematika', 3, 21, '21', '24', '27', '30', 'B', 'Šola'),
('Katera je množina besede "pes"?', 'Slovenščina', 3, 22, 'Pesa', 'Pesi', 'Psov', 'Pesov', 'B', 'Šola'),
('Iz česa se naredi papir?', 'Naravoslovje', 3, 23, 'Iz kamna', 'Iz lesa', 'Iz železa', 'Iz plastike', 'B', 'Šola'),
('Koliko je 45 ÷ 5?', 'Matematika', 3, 24, '8', '9', '10', '11', 'B', 'Šola'),
('Katero glavno mesto ima Slovenija?', 'Družba', 3, 25, 'Maribor', 'Celje', 'Ljubljana', 'Kranj', 'C', 'Šola'),
('Koliko strani ima trikotnik?', 'Matematika', 3, 26, '2', '3', '4', '5', 'B', 'Šola'),
('Kateri organ črpa kri po telesu?', 'Naravoslovje', 3, 27, 'Možgani', 'Srce', 'Jetra', 'Pljuča', 'B', 'Šola'),
('Koliko je 100 - 37?', 'Matematika', 3, 28, '63', '67', '73', '77', 'A', 'Šola'),
('Kateri planet je najbližji Soncu?', 'Naravoslovje', 3, 29, 'Venera', 'Zemlja', 'Merkur', 'Mars', 'C', 'Šola'),
('Koliko je 7 × 8?', 'Matematika', 3, 30, '54', '56', '58', '60', 'B', 'Šola'),

-- Grade 4 Questions (difficulty_order 31-40)
('Koliko je 144 ÷ 12?', 'Matematika', 4, 31, '11', '12', '13', '14', 'B', 'Šola'),
('Kateri samostalnik je ženskega spola?', 'Slovenščina', 4, 32, 'Miza', 'Stol', 'Kruh', 'Avto', 'A', 'Šola'),
('Kateri proces potrebujejo rastline za pridobivanje energije?', 'Naravoslovje', 4, 33, 'Dihanje', 'Fotosinteza', 'Prebava', 'Izločanje', 'B', 'Šola'),
('Koliko je 0,5 + 0,3?', 'Matematika', 4, 34, '0,7', '0,8', '0,9', '1,0', 'B', 'Šola'),
('V katerem letu je Slovenija postala samostojna?', 'Družba', 4, 35, '1990', '1991', '1992', '1993', 'B', 'Šola'),
('Koliko stopinj ima pravi kot?', 'Matematika', 4, 36, '45°', '60°', '90°', '180°', 'C', 'Šola'),
('Katero snov potrebujemo za dihanje?', 'Naravoslovje', 4, 37, 'Vodík', 'Kisík', 'Ogljík', 'Dušík', 'B', 'Šola'),
('Koliko je 25% od 80?', 'Matematika', 4, 38, '15', '20', '25', '30', 'B', 'Šola'),
('Kateri ocean je največji?', 'Geografija', 4, 39, 'Atlantski', 'Indijski', 'Tihi', 'Arktični', 'C', 'Šola'),
('Koliko je 13 × 11?', 'Matematika', 4, 40, '133', '143', '153', '163', 'B', 'Šola'),

-- Grade 5 Questions (difficulty_order 41-50)
('Koliko je 2³?', 'Matematika', 5, 41, '6', '8', '9', '12', 'B', 'Šola'),
('Kateri tip besed opisuje lastnosti?', 'Slovenščina', 5, 42, 'Samostalniki', 'Glagoli', 'Pridevniki', 'Prislovi', 'C', 'Šola'),
('Kateri sistem organov skrbi za transport snovi?', 'Naravoslovje', 5, 43, 'Prebavni', 'Žilni', 'Dihalni', 'Živčni', 'B', 'Šola'),
('Koliko je 3/4 od 120?', 'Matematika', 5, 44, '80', '90', '100', '110', 'B', 'Šola'),
('Kdaj se je zgodila druga svetovna vojna?', 'Zgodovina', 5, 45, '1914-1918', '1939-1945', '1941-1945', '1950-1955', 'B', 'Šola'),
('Koliko je obseg kroga s polmerom 5 cm? (π ≈ 3,14)', 'Matematika', 5, 46, '25,12 cm', '31,4 cm', '15,7 cm', '78,5 cm', 'B', 'Šola'),
('Kateri plin najbolj prispeva k toplogrednem učinku?', 'Naravoslovje', 5, 47, 'Kisík', 'Dušík', 'Ogljikov dioksid', 'Vodik', 'C', 'Šola'),
('Koliko je √64?', 'Matematika', 5, 48, '6', '7', '8', '9', 'C', 'Šola'),
('Katera je največja celina?', 'Geografija', 5, 49, 'Afrika', 'Azija', 'Evropa', 'Severna Amerika', 'B', 'Šola'),
('Koliko je 15² - 14²?', 'Matematika', 5, 50, '28', '29', '30', '31', 'B', 'Šola');

-- Step 3: Update the question selection function to prioritize grade progression
CREATE OR REPLACE FUNCTION public.select_and_reserve_game_questions(p_game_id uuid, p_category text, p_question_count integer DEFAULT 15)
 RETURNS TABLE(result_question_id uuid, result_question_order integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  rec RECORD;
  order_num integer := 1;
BEGIN
  -- Clear existing questions for this game
  DELETE FROM game_questions WHERE game_id = p_game_id;
  
  -- Select questions with grade progression priority
  FOR rec IN 
    SELECT q.id as qid
    FROM questions q
    LEFT JOIN question_usage qu ON q.id = qu.question_id
    WHERE q.category = p_category
    ORDER BY 
      q.grade_level ASC,                                           -- Primary: Grade progression 1→12
      q.difficulty_order ASC,                                      -- Secondary: Difficulty within grade
      COALESCE(qu.usage_count, 0) ASC,                            -- Tertiary: Least used first
      COALESCE(qu.last_used_at, '1970-01-01'::timestamp) ASC,     -- Quaternary: Oldest usage
      RANDOM()                                                     -- Final: Random variety
    LIMIT p_question_count
  LOOP
    -- Insert into game_questions
    INSERT INTO game_questions (game_id, question_id, question_order)
    VALUES (p_game_id, rec.qid, order_num);
    
    -- Update question usage
    INSERT INTO question_usage (question_id, usage_count, last_used_at, updated_at)
    VALUES (rec.qid, 1, NOW(), NOW())
    ON CONFLICT (question_id) 
    DO UPDATE SET 
      usage_count = question_usage.usage_count + 1,
      last_used_at = NOW(),
      updated_at = NOW();
    
    -- Return this record
    result_question_id := rec.qid;
    result_question_order := order_num;
    RETURN NEXT;
    
    order_num := order_num + 1;
  END LOOP;
  
  RETURN;
END;
$function$