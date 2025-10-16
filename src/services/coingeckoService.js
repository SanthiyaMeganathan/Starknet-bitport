// src/services/coingeckoService.js

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// -------------------------
// 1. Get Current BTC Price in USD
// -------------------------
export const getBTCPrice = async () => {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/simple/price?ids=bitcoin&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch BTC price');
    }
    
    const data = await response.json();
    return data.bitcoin.usd;
  } catch (err) {
    console.error('Error fetching BTC price:', err);
    return 0;
  }
};

// -------------------------
// 2. Get BTC Market Data (with 24h change)
// -------------------------
export const getBTCMarketData = async () => {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch BTC market data');
    }
    
    const data = await response.json();
    
    return {
      currentPrice: data.market_data.current_price.usd,
      priceChange24h: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      high24h: data.market_data.high_24h.usd,
      low24h: data.market_data.low_24h.usd,
    };
  } catch (err) {
    console.error('Error fetching BTC market data:', err);
    return {
      currentPrice: 0,
      priceChange24h: 0,
      marketCap: 0,
      volume24h: 0,
      high24h: 0,
      low24h: 0,
    };
  }
};

// -------------------------
// 3. Convert BTC to USD
// -------------------------
export const convertBTCToUSD = async (btcAmount) => {
  try {
    const price = await getBTCPrice();
    return (parseFloat(btcAmount) * price).toFixed(2);
  } catch (err) {
    console.error('Error converting BTC to USD:', err);
    return '0.00';
  }
};

// -------------------------
// 4. Get BTC Price Chart Data (7 days)
// -------------------------
export const getBTCChartData = async (days = 7) => {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch chart data');
    }
    
    const data = await response.json();
    
    // Format data for Chart.js
    return data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price: price.toFixed(2),
    }));
  } catch (err) {
    console.error('Error fetching BTC chart data:', err);
    return [];
  }
};