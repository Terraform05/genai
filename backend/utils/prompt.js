export function generatePrompt(companyInfo, processedFileText) {
  const analysisPrompt = `If no filing data is provided, use the most recent knowledge available to return a complete response as if the data were available. Ensure the analysis is detailed and follows the same structure.

  Analyze the following excerpts from the company ${companyInfo.name} in the ${companyInfo.industry} industry to evaluate both the credit and equity bull vs bear case. Do not include any introductory or concluding remarks—only provide the analysis.

1. Rate it separately for credit and equity on a scale of 1-5/5 bull/bear with 1 being very bearish, 5 being very bullish
2. Provide key supporting evidence from the provided document text (include page numbers from the text)
3. Flag any significant risks or concerns
4. Ratings should be based on the information provided in the text

Key areas to analyze:

Financial Health & Growth:
- Revenue growth trends and quality
- Margin evolution and profitability
- Cash flow generation
- Balance sheet strength
- Capital allocation strategy

Market Position:
- Market share trends
- Competitive advantages
- Brand strength
- Industry position
- Geographic expansion opportunities

Business Model:
- Revenue diversification
- Customer concentration
- Pricing power
- Operating leverage
- Recurring revenue %

Management & Governance:
- Executive compensation alignment
- Capital allocation track record
- Corporate governance practices
- Insider ownership
- Management credibility

Risk Factors:
- Regulatory environment
- Technology disruption risk
- Customer/supplier concentration
- Geographic/political exposure
- Industry-specific risks

Growth Investments:
- R&D spending trends
- Capital expenditure plans
- M&A strategy
- New product pipeline
- Market expansion initiatives

After analyzing these categories, provide:

1. An overall bull/bear rating (1-5/5 bull/bear) separately for both credit and equity
2. The top 3 bull and bear considerations for both credit and equity
3. Key metrics to monitor going forward
4. Potential catalysts (both positive and negative)
5. Areas where additional research beyond the 10-K would be valuable

Do not include any extra wording or explanations outside of the requested analysis.
`;

  return `${analysisPrompt}\n\n${processedFileText}`;
}
