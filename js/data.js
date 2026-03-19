// Каталог букетов и роз — пути к фото в images/catalog/ (при отсутствии — заглушка)
const DEFAULT_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="8" fill="#fce4ec"/><path d="M60 30c-5 12-20 15-25 8 8 4 12 14 8 22 10-2 18 6 16 16 6-8 2-18 4-26-6 6-11 0-9-10 2 10-7 14-14 10z" fill="#c2185b" opacity="0.8"/><text x="60" y="95" font-family="sans-serif" font-size="10" fill="#880e4f" text-anchor="middle">Розы</text></svg>');

const PRODUCTS = [
  { id: 1, name: '25 красных роз «Классика»', category: 'classic', price: 3500, description: 'Классический букет из 25 свежих красных роз. Идеален для признания в любви и романтического вечера. Упаковка и открытка в подарок.', image: 'images/catalog/1.jpg' },
  { id: 2, name: '51 роза «Роскошь»', category: 'classic', price: 6200, description: 'Роскошный букет из 51 розы. Премиальная упаковка, доставка в подарочной коробке. Впечатляющий подарок на юбилей или годовщину.', image: 'images/catalog/2.jpg' },
  { id: 3, name: '101 роза «Легенда»', category: 'premium', price: 11500, description: 'Легендарный букет из 101 розы. Максимум эмоций и восхищения. Доставка курьером в удобное время.', image: 'images/catalog/3.jpg' },
  { id: 4, name: 'Букет «Нежность» (15 роз пионовидных)', category: 'bouquet', price: 4200, description: 'Пионовидные розы нежных оттенков в кружевной упаковке. Идеально для мамы, подруги или коллеги.', image: 'images/catalog/4.jpg' },
  { id: 5, name: 'Букет «Свадебный» (белые розы)', category: 'wedding', price: 5800, description: 'Элегантный свадебный букет из белых роз и зелени. Невеста или оформление банкета. Консультация флориста бесплатно.', image: 'images/catalog/5.jpg' },
  { id: 6, name: '7 роз «Мини» в коробке', category: 'single', price: 1900, description: 'Компактный подарок: 7 роз в стильной коробке. Удобно везти в гости или вручить лично.', image: 'images/catalog/6.jpg' },
  { id: 7, name: 'Букет «Элегант» (25 роз микс)', category: 'bouquet', price: 4100, description: 'Микс из роз разных оттенков: красные, розовые, кремовые. Универсальный подарок на любой праздник.', image: 'images/catalog/7.jpg' },
  { id: 8, name: 'Коробка «Сердце» (21 роза)', category: 'premium', price: 4900, description: 'Розы в подарочной коробке в форме сердца. День святого Валентина, признание в любви, предложение руки и сердца.', image: 'images/catalog/8.jpg' },
  { id: 9, name: '15 красных роз «Стандарт»', category: 'classic', price: 2400, description: 'Проверенный вариант: 15 красных роз, плёнка и лента. Быстрая доставка по Брянску в день заказа.', image: 'images/catalog/9.jpg' },
  { id: 10, name: 'Букет «Букет невесты» (свадебный)', category: 'wedding', price: 7500, description: 'Авторский свадебный букет: розы, эвкалипт, гипсофила. Подбор под платье и стиль свадьбы.', image: 'images/catalog/10.jpg' },
  { id: 11, name: '1 роза в колбе', category: 'single', price: 650, description: 'Одна роза в декоративной колбе. Символичный подарок «ты одна такая». Долго сохраняет вид.', image: 'images/catalog/11.jpg' },
  { id: 12, name: 'Букет «Радость» (19 роз)', category: 'bouquet', price: 3600, description: 'Яркий букет из 19 роз в жизнерадостных тонах. День рождения, 8 Марта, просто так.', image: 'images/catalog/12.jpg' },
];
