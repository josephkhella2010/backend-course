# Exercise 1: Agent or automation?

| #   | Type       | Explanation                                                                                                |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | Automation | It follows fixed steps every Monday to export new users and email the list.                                |
| 2   | Agent      | It must understand the user's question, find the correct order, check the date and read the return policy. |
| 3   | Automation | It uses AI to summarise posts, but it follows the same fixed steps every night.                            |
| 4   | Automation | It always sends a Slack message when a new GitHub issue is created.                                        |
| 5   | Agent      | It checks the calendar and weather, then decides where the user should study.                              |
| 6   | Automation | It always saves the contact form and sends a thank-you email.                                              |

### Question 1

Scenario 3 uses AI to summarise Reddit posts, but it is still an automation because it follows the same fixed steps every night. The AI does not decide which actions or tools to use.

### Question 2

An automation is often cheaper and faster. It is also easier to test and debug because it follows fixed steps. An agent can cost more and make unexpected decisions. If a simple automation works, we do not need an agent.

# Exercise 2: Building my first AI agent

### Question 1: What happened when the context window was 1, and when there was no memory? Explain what the context window length means.

When the context window was set to 1, my agent could still remember that I lived in Stockholm. The context window length controls how many previous conversation interactions the AI receives as context.

When I removed the Simple Memory node completely, the agent could not remember my name from the earlier conversation. It asked me to introduce myself again.

### Question 2: Why not just set the context window to 1000?

A context window of 1000 would make the model read a much larger amount of conversation history with every new message. This uses more tokens, which increases the cost and can make responses slower. It can also include irrelevant information. Therefore, it is better to use only as much conversation history as the agent needs.

# Exercise 3: Your first tool

### Question 1: Which questions made the agent use the weather tool, and which didn't? How did it decide?

The agent used the OpenWeatherMap tool for the umbrella and jacket questions because they needed weather information.

It did not use the weather tool for the multiplication question because it could answer 12 times 7 using its own knowledge.

The agent decided when to use the tool by understanding what information was needed to answer each question.

### Question 2: What is the difference between an agent and an automation? Explain using the logs.

An automation follows fixed steps every time. An AI agent can decide what action or tool to use depending on the user's question.

In my logs, the agent called OpenWeatherMap for the weather questions but did not call it for the maths question. This shows that the agent can make decisions by itself.

### Question 3: What would change if OpenWeatherMap offered an MCP server? Name one advantage.

If OpenWeatherMap offered an MCP server, different AI applications could connect to its weather tools using the same standard.

One advantage is that the weather tool could be used by different AI applications without building a separate integration for each application.

# Exercise 4: Build your own tool with an HTTP request

### Question 1: Explain API, HTTP request and function in your own words.

An API is like a vending machine. It allows us to ask for something and receive a result.

An HTTP request is like pressing a button on the vending machine. It sends a request to the API to ask for information or perform an action.

A function is the specific action that the API performs. For example, in my Express API, `GET /items` is an endpoint that gets and returns a list of items.

In this exercise, I sent an HTTP GET request to the Open-Meteo API to get current air-quality information.

### Question 2: What happened when you changed the tool's description to something vague?

When I changed the tool description to just "tool", the agent had trouble understanding when to use it. It could not provide the air-quality information in its answer.

When I changed the description back to a clear explanation, the agent could understand the purpose of the tool better.

I learned that a clear tool description helps an AI agent decide when a tool is useful.

# Exercise 5: Write a real prompt

## Bad prompt test

**System message:** `Help the user.`

1. **Should I go running outside today?**  
   The agent said it was a good day for running because the air quality was good. It also mentioned the cold and humid weather.

2. **Do I need a jacket if I go out tonight?**  
   The agent recommended a warm, wind-resistant jacket because it was around 4–5°C.

3. **Is it safe to cycle outside today?**  
   The agent said cycling was generally safe but advised using lights, reflective clothing and taking care on wet roads.

## Structured prompt test

1. **Should I go running outside today?**  
   The agent considered the rain, cold temperature and air quality. It recommended running with suitable clothing or going to the gym.

2. **Do I need a jacket if I go out tonight?**  
   The agent recommended a water-resistant, wind-resistant jacket because it was cold and rainy.

3. **Is it safe to cycle outside today?**  
   The agent recommended the gym or staying indoors because of the cold, rain and slippery roads. It also considered the good air quality.

### Question 1: Compare the answers from the bad prompt and the structured prompt. Give two concrete differences.

1. With the bad prompt, the agent gave more general answers. With the structured prompt, it gave more detailed advice based on weather and air quality.

2. With the bad prompt, the agent mainly answered the question. With the structured prompt, it also suggested alternatives, such as going to the gym instead of running or cycling in bad weather.

### Question 2: Which of the six parts made the biggest difference for your agent, and why?

I think the Tools and Constraints parts made the biggest difference. The Tools part explained when the agent should use weather and air-quality information. The Constraints part told the agent to give safe and practical advice, consider the weather conditions and not invent information. This made the answers more useful and specific.

### Question 3: Why would skills be better than one huge prompt?

Skills are better because the agent only reads the instructions it needs for the current task. One huge prompt would be read every time, even when some instructions are not relevant. Skills can save tokens, reduce costs and keep the main prompt shorter and easier to understand.

# Exercise 6: Break it on purpose

### Error 1 — Wrong city name

| What I broke                           | Which node failed | Error message (short) | What the message told me                               |
| -------------------------------------- | ----------------- | --------------------- | ------------------------------------------------------ |
| Changed the city to `Stockholm Sweden` | OpenWeatherMap    | `city not found`      | The city name or format was not recognised by the API. |

### Error 2 — Typo in the Open-Meteo URL

| What I broke                                  | Which node failed              | Error message (short) | What the message told me                                                    |
| --------------------------------------------- | ------------------------------ | --------------------- | --------------------------------------------------------------------------- |
| Changed `air-quality-api` to `air-qualty-api` | HTTP Request (Get air quality) | `Not Found`           | The URL was incorrect, so the server could not find the requested resource. |

### Error 3 — Wrong API key

| What I broke                                        | Which node failed | Error message (short) | What the message told me                                           |
| --------------------------------------------------- | ----------------- | --------------------- | ------------------------------------------------------------------ |
| Replaced the real API key with `WRONG_TEST_API_KEY` | OpenWeatherMap    | `Invalid API key`     | The API key was not valid, so OpenWeatherMap rejected the request. |

## Question I gave the AI\*\*

I got this error in n8n when using the OpenWeatherMap node:

"Authorization failed - please check your credentials. Invalid API key."

What does this error mean, and how can I fix it?

**Was the AI's answer correct?**

Yes. The AI explained that the API key was invalid. I restored the original API key, and the OpenWeatherMap node worked again.

## Question 1: One of your errors may not have stopped the workflow. Instead, the agent just gave a strange or wrong answer. Why is that kind of error more dangerous than a red error message?\*\*

**Answer:**

This kind of error is more dangerous because the workflow looks successful, even though the answer is wrong. The user may trust the incorrect information and make a bad decision. A red error message is easier to notice because it clearly shows that something went wrong.

## Question 2: You learned to read error reports in the Sentry week. What is similar about finding errors in n8n, and what is different?\*\*

**Answer:**

Both n8n and Sentry help us find and understand errors. They show error messages and help us identify what went wrong.

The difference is that n8n shows which workflow node failed and provides information about that step. Sentry monitors applications and helps developers find errors in their code.

Both tools help us investigate and fix problems.
