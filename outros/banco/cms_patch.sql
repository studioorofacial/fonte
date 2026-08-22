USE db_studioorofacial;

-- Execute uma vez em bases criadas com a versão anterior do main-v2.
ALTER TABLE main
  ADD COLUMN page_key VARCHAR(30) NULL AFTER subtitle;

-- Mapeamento inicial baseado nos títulos atualmente usados pelos seeds.
UPDATE main
   SET page_key = CASE
     WHEN LOWER(title) LIKE '%catálogo%' OR LOWER(title) LIKE '%catalogo%' THEN 'catalogo'
     WHEN LOWER(title) LIKE '%contato%' OR LOWER(title) LIKE '%contacto%' THEN 'contato'
     WHEN LOWER(title) LIKE '%sobre%' THEN 'sobre'
     ELSE 'home'
   END
 WHERE page_key IS NULL;

ALTER TABLE main
  MODIFY COLUMN page_key VARCHAR(30) NOT NULL;

CREATE INDEX idx_main_page_key ON main (page_key);
