"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Clock, Euro, ArrowRight, Download, Calendar, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface FormData {
  companyName: string
  firstName: string
  email: string
  weeklyInquiries: number
  timePerOffer: number
  dataStorage: string[]
  followUpFrequency: string
  paymentReminders: string[]
  dataCollection: string
  reviewRequests: string
  averageMargin: string
  hourlyRate: string
}

export default function BusinessAuditTool() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    firstName: "",
    email: "",
    weeklyInquiries: 10,
    timePerOffer: 60,
    dataStorage: [],
    followUpFrequency: "",
    paymentReminders: [],
    dataCollection: "",
    reviewRequests: "",
    averageMargin: "",
    hourlyRate: "50",
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Calculations for the report
  const calculateResults = () => {
    const weeklyOfferTime = formData.weeklyInquiries * formData.timePerOffer
    const monthlyOfferHours = (weeklyOfferTime / 60) * 4.33
    const monthlyOfferDays = monthlyOfferHours / 8

    const potentialLostRevenue =
      formData.followUpFrequency !== "Zawsze, staram się dzwonić lub pisać do każdego."
        ? formData.weeklyInquiries * 0.3 * 4.33 * Number.parseFloat(formData.averageMargin || "0")
        : 0

    const weeklyAdminTime = weeklyOfferTime / 60 + 2
    const weeklyCost = weeklyAdminTime * Number.parseFloat(formData.hourlyRate || "50")
    const yearlyCost = weeklyCost * 52

    return {
      weeklyOfferTime,
      monthlyOfferHours: Math.round(monthlyOfferHours * 10) / 10,
      monthlyOfferDays: Math.round(monthlyOfferDays * 10) / 10,
      potentialLostRevenue: Math.round(potentialLostRevenue),
      weeklyCost: Math.round(weeklyCost),
      yearlyCost: Math.round(yearlyCost),
    }
  }

  const getDiagnosis = () => {
    const issues = []
    if (formData.timePerOffer > 30) issues.push("Tworzenie Ofert")
    if (
      formData.dataStorage.includes("W głowie / na kartkach") ||
      formData.followUpFrequency !== "Zawsze, staram się dzwonić lub pisać do każdego."
    ) {
      issues.push("Śledzenie Zapytań")
    }
    if (
      !formData.paymentReminders.includes("Mój system robi to automatycznie") ||
      formData.dataCollection !== "Używam formularza online do zbierania danych"
    ) {
      issues.push("Obsługa Płatności i Dokumentów")
    }
    if (formData.reviewRequests !== "Tak, mam na to zautomatyzowany proces.") {
      issues.push("Budowanie Reputacji")
    }

    let syndrome = "Syndrom Manualnego Przeciążenia"
    if (issues.length >= 3) syndrome = "Chroniczny Brak Czasu"
    if (formData.followUpFrequency === "Prawie nigdy, nie mam na to czasu.") syndrome = "Syndrom Dziurawego Lejka"

    return { syndrome, issues }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center items-center space-x-4 mb-6">
                <Clock className="h-12 w-12 text-blue-600" />
                <ArrowRight className="h-8 w-8 text-gray-400" />
                <Euro className="h-12 w-12 text-orange-500" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Audyt Automatyzacji Twojego Biura Podróży</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Odkryj, ile godzin i pieniędzy tracisz na ręcznej pracy. Wypełnij ankietę w 3 minuty i otrzymaj
                bezpłatny, spersonalizowany raport dostępny od razu online i w formie PDF.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg max-w-2xl mx-auto">
                <p className="text-blue-800 text-sm">
                  <strong>Gwarancja prywatności:</strong> Wypełnienie pola e-mail nie oznacza wysyłania przez nas
                  żadnych wiadomości czy spamu. Skontaktujemy się z Tobą tylko i wyłącznie jeśli sam umówisz
                  konsultację.
                </p>
              </div>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nazwa biura podróży</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData("companyName", e.target.value)}
                  placeholder="np. Wakacje Marzeń"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">Twoje imię</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="np. Anna"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adres e-mail (tutaj wyślemy Twój raport)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="anna@wakacjemarzen.pl"
                  required
                />
              </div>

              <Button
                onClick={nextStep}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg"
                disabled={!formData.email}
              >
                Rozpocznij Audyt
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Krok 1/4: Zarządzanie Zapytaniami i Ofertami</h2>
              <p className="text-gray-600">
                Bądź szczery. Te dane posłużą do obliczenia Twoich potencjalnych oszczędności.
              </p>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              <div className="space-y-4">
                <Label className="text-lg font-medium">Ile zapytań o wycieczki otrzymujesz średnio w tygodniu?</Label>
                <div className="space-y-2">
                  <Slider
                    value={[formData.weeklyInquiries]}
                    onValueChange={(value) => updateFormData("weeklyInquiries", value[0])}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-blue-600">{formData.weeklyInquiries}</span>
                    <span className="text-gray-600 ml-2">zapytań tygodniowo</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  Ile czasu (w minutach) zajmuje Ci średnio przygotowanie JEDNEJ, spersonalizowanej oferty dla klienta?
                </Label>
                <p className="text-sm text-gray-500">(od wyszukania hoteli po wysłanie maila)</p>
                <div className="space-y-2">
                  <Slider
                    value={[formData.timePerOffer]}
                    onValueChange={(value) => updateFormData("timePerOffer", value[0])}
                    max={240}
                    min={15}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-blue-600">{formData.timePerOffer}</span>
                    <span className="text-gray-600 ml-2">minut na ofertę</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  Gdzie zapisujesz informacje o zapytaniach i klientach? (Wybierz wszystkie pasujące)
                </Label>
                <div className="space-y-3">
                  {[
                    "W głowie / na kartkach",
                    "W zeszycie",
                    "W pliku Excel / Arkuszu Google",
                    "W programie pocztowym (np. Outlook)",
                    "Posiadamy system CRM",
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={formData.dataStorage.includes(option)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData("dataStorage", [...formData.dataStorage, option])
                          } else {
                            updateFormData(
                              "dataStorage",
                              formData.dataStorage.filter((item) => item !== option),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  Jak często kontaktujesz się ponownie (follow-up) z klientem, który otrzymał ofertę, ale nie
                  odpowiedział?
                </Label>
                <RadioGroup
                  value={formData.followUpFrequency}
                  onValueChange={(value) => updateFormData("followUpFrequency", value)}
                >
                  {[
                    "Prawie nigdy, nie mam na to czasu.",
                    "Czasami, gdy sobie przypomnę.",
                    "Zawsze, staram się dzwonić lub pisać do każdego.",
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700">
                Dalej
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Krok 2/4: Obsługa Posprzedażowa i Administracja</h2>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  Jak przypominasz klientom o terminach płatności (zaliczka, dopłata)?
                </Label>
                <div className="space-y-3">
                  {[
                    "Ręcznie wysyłam maile",
                    "Dzwonię do każdego klienta",
                    "Zapisuję w kalendarzu i liczę, że nie zapomnę",
                    "Mój system robi to automatycznie",
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={formData.paymentReminders.includes(option)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData("paymentReminders", [...formData.paymentReminders, option])
                          } else {
                            updateFormData(
                              "paymentReminders",
                              formData.paymentReminders.filter((item) => item !== option),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  Jak zbierasz dane uczestników wycieczki (dane do rezerwacji, numery paszportów)?
                </Label>
                <RadioGroup
                  value={formData.dataCollection}
                  onValueChange={(value) => updateFormData("dataCollection", value)}
                >
                  {[
                    "Proszę o wysłanie mailem lub w wiadomości",
                    "Proszę klienta o przyjście do biura z dokumentami",
                    "Używam formularza online do zbierania danych",
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  Czy systematycznie prosisz klientów o wystawienie opinii po powrocie z wakacji?
                </Label>
                <RadioGroup
                  value={formData.reviewRequests}
                  onValueChange={(value) => updateFormData("reviewRequests", value)}
                >
                  {[
                    "Nie, zapominam o tym lub nie mam czasu.",
                    "Czasami, wysyłam pojedyncze prośby.",
                    "Tak, mam na to zautomatyzowany proces.",
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex space-x-4">
                <Button onClick={prevStep} variant="outline" className="flex-1">
                  Wstecz
                </Button>
                <Button onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Dalej
                </Button>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Krok 3/4: Wycena Twojego Czasu</h2>
              <p className="text-gray-600">
                To kluczowy krok. Aby obliczyć, ile pieniędzy tracisz, musimy wiedzieć, ile warta jest Twoja godzina
                pracy. Bądź realistą.
              </p>
            </div>

            <div className="space-y-8 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="averageMargin" className="text-lg font-medium">
                  Ile w przybliżeniu wynosi średnia marża (Twój zysk) na jednej sprzedanej wycieczce?
                </Label>
                <div className="relative">
                  <Input
                    id="averageMargin"
                    type="number"
                    value={formData.averageMargin}
                    onChange={(e) => updateFormData("averageMargin", e.target.value)}
                    placeholder="500"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">PLN</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate" className="text-lg font-medium">
                  Ile jest warta godzina Twojej pracy lub pracy Twojego agenta?
                </Label>
                <p className="text-sm text-gray-500">
                  (Jeśli nie wiesz, wpisz 50 PLN - to rynkowy standard dla pracy administracyjnej)
                </p>
                <div className="relative">
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => updateFormData("hourlyRate", e.target.value)}
                    placeholder="50"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">PLN</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={prevStep} variant="outline" className="flex-1">
                  Wstecz
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg"
                  disabled={!formData.averageMargin || !formData.hourlyRate}
                >
                  Generuj Mój Raport!
                </Button>
              </div>
            </div>
          </div>
        )

      case 5:
        const results = calculateResults()
        const diagnosis = getDiagnosis()

        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">Raport Automatyzacji dla {formData.companyName}</h1>
              <p className="text-xl text-gray-600">Przygotowany dla {formData.firstName}</p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {/* Card 1: Time Sink */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-6 w-6 text-red-500" />
                    <span>Pożeracz Czasu: Tworzenie Ofert</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600">{results.monthlyOfferHours} godzin</div>
                    <div className="text-gray-600">miesięcznie na tworzenie ofert</div>
                  </div>
                  <p className="text-gray-700">
                    Co tydzień spędzasz <strong>{Math.round((results.weeklyOfferTime / 60) * 10) / 10} godzin</strong>{" "}
                    na samym przygotowywaniu ofert. To <strong>{results.monthlyOfferHours} godzin</strong> miesięcznie -
                    odpowiednik <strong>{results.monthlyOfferDays} dni roboczych!</strong>
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 font-medium">
                      💡 Rekomendacja: Można to zredukować o 90% dzięki automatycznemu generatorowi ofert.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Lost Money */}
              {results.potentialLostRevenue > 0 && (
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-6 w-6 text-orange-500" />
                      <span>Utracone Zyski: Brak Follow-upu</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600">
                        {results.potentialLostRevenue.toLocaleString()} PLN
                      </div>
                      <div className="text-gray-600">potencjalnie utracone miesięcznie</div>
                    </div>
                    <p className="text-gray-700">
                      Badania pokazują, że ponad 50% sprzedaży dokonuje się po pierwszym kontakcie. Nie robiąc
                      systematycznego follow-upu, możesz tracić nawet{" "}
                      <strong>{results.potentialLostRevenue.toLocaleString()} PLN</strong> potencjalnego zysku
                      miesięcznie, zakładając ostrożnie 30% utraconych szans.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        💡 Rekomendacja: Prosty automat do follow-upów może odzyskać część tych pieniędzy, pracując za
                        Ciebie.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Card 3: Hidden Cost */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Euro className="h-6 w-6 text-blue-500" />
                    <span>Koszt Ręcznej Pracy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{results.weeklyCost} PLN</div>
                      <div className="text-gray-600">tygodniowo</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{results.yearlyCost.toLocaleString()} PLN</div>
                      <div className="text-gray-600">rocznie</div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Każdego tygodnia "przepalasz" <strong>{results.weeklyCost} PLN</strong> na zadania, które może
                    wykonać automat. Rocznie daje to kwotę <strong>{results.yearlyCost.toLocaleString()} PLN</strong>.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Koszt Twojej pracy (rocznie):</span>
                      <span className="text-xl font-bold text-blue-600">{results.yearlyCost.toLocaleString()} PLN</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium">Koszt Automatyzacji (rocznie):</span>
                      <span className="text-xl font-bold text-green-600">3,588 PLN</span>
                    </div>
                    <div className="border-t mt-2 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Oszczędności:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {(results.yearlyCost - 3588).toLocaleString()} PLN
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Diagnosis */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-6 w-6 text-purple-500" />
                    <span>Twoja Diagnoza i Plan Działania</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-purple-800 font-bold text-lg">Twoje biuro cierpi na: {diagnosis.syndrome}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-3">Twoje największe obszary do natychmiastowej poprawy to:</p>
                    <div className="space-y-2">
                      {diagnosis.issues.map((issue) => (
                        <div key={issue} className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-red-500" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg text-center space-y-6">
              <h2 className="text-3xl font-bold">Jesteś gotowy odzyskać swój czas i pieniądze?</h2>
              <p className="text-xl max-w-3xl mx-auto">
                Twój raport pokazuje jasno, gdzie leży problem. Dobra wiadomość jest taka, że można go rozwiązać. Szybko
                i skutecznie.
              </p>
              <p className="text-lg">
                Umów się na bezpłatną, 15-minutową konsultację strategiczną, podczas której pokażę Ci, jak DOKŁADNIE
                wdrożyć te automatyzacje w Twoim biurze. Bez zobowiązań, bez lania wody.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Umów Bezpłatną Konsultację
                </Button>
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  <Download className="h-5 w-5 mr-2" />
                  Pobierz Raport w PDF
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {currentStep > 1 && currentStep < 5 && (
          <div className="mb-8">
            <Progress value={progress} className="w-full max-w-2xl mx-auto" />
            <p className="text-center mt-2 text-gray-600">
              Krok {currentStep - 1} z {totalSteps - 1}
            </p>
          </div>
        )}

        <div className="max-w-6xl mx-auto">{renderStep()}</div>
      </div>
    </div>
  )
}
