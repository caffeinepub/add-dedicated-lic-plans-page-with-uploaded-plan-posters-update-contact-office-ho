import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQ() {
  const faqs = [
    {
      question: 'What is the difference between term insurance and endowment plans?',
      answer: 'Term insurance provides pure life coverage at affordable premiums with no maturity benefit. Endowment plans combine life cover with savings, offering both death benefit and maturity benefit if you survive the policy term.'
    },
    {
      question: 'How much life insurance coverage do I need?',
      answer: 'A general rule is to have coverage of 10-15 times your annual income. However, the ideal amount depends on your financial obligations, dependents, debts, and future goals. I can help you calculate the right coverage for your situation.'
    },
    {
      question: 'Can I change my policy or add riders later?',
      answer: 'Yes, LIC offers flexibility to modify certain aspects of your policy. You can add riders like critical illness or accidental death benefit at policy inception or during specific policy anniversaries, subject to terms and conditions.'
    },
    {
      question: 'What are the tax benefits of LIC policies?',
      answer: 'Premiums paid are eligible for deduction under Section 80C (up to ₹1.5 lakh). Maturity proceeds and death benefits are tax-free under Section 10(10D), subject to conditions. Pension plans offer additional benefits under Section 80CCC.'
    },
    {
      question: 'How do I file a claim?',
      answer: 'I assist with the entire claim process. For death claims, nominees need to submit the claim form, death certificate, and policy documents. For maturity claims, the process is simpler. I guide you through every step to ensure smooth processing.'
    },
    {
      question: 'What happens if I miss a premium payment?',
      answer: 'LIC provides a grace period (usually 30 days for monthly/quarterly and 60 days for half-yearly/yearly modes). If payment is not made within the grace period, the policy lapses but can be revived within a specified period with interest and medical requirements.'
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about LIC insurance policies and services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <p className="text-muted-foreground">
            Have more questions? Feel free to reach out through the contact form below, 
            and I'll be happy to help!
          </p>
        </div>
      </div>
    </section>
  );
}
