"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import { useBannerImage } from "@/app/theme/utils/UseBannerImage";
import GradientButton from "@/components/button/GradientButton";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import FormDisclaimer from "../common/FormDisclaimer";
import { useLanguage } from "@/core/runtime";
import {
  getFormTranslation,
  getSubscriptionsTranslation,
} from "@/core/translations";
import { callPublicApi } from "@/core/utils";
import { Alert, Box, TextField, Typography } from "@mui/material";
import { primaryLanguage } from "@/core/static";

type SubmitStatus = "success" | "error" | null;

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/*
 * Newsletter band from the Figma frame (1440x520): the photograph in a card inset 20px with
 * a 25 radius, and the whole block centred inside it — title, then the field and button on
 * one row, then the disclaimer.
 *
 * ui-001 ran this full-bleed with a three-stop gradient and background-attachment: fixed.
 * The fixed attachment is the reason this band juddered while scrolling on iOS; the design
 * asks for a flat 60 % overlay, which also costs nothing to paint.
 */
export default function SubscribeSection() {
  const resolvedHeaderImage = useBannerImage();

  const { lang } = useLanguage();
  const subscriptionsTranslation = getSubscriptionsTranslation(lang);
  const formTranslations = getFormTranslation(lang);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail) || !normalizedEmail) {
      setEmailError(formTranslations.email.errorMessage);
      return;
    }

    setEmailError(null);
    setSubmitStatus(null);
    setIsSubmitting(true);

    try {
      await callPublicApi("newsletter", {
        body: {
          email: normalizedEmail,
          locale:
            lang?.toLocaleLowerCase() ?? primaryLanguage.toLocaleLowerCase(),
        },
      });

      setEmail("");
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!submitStatus) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSubmitStatus(null);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [submitStatus]);

  return (
    <Box component="section" sx={{ p: { xs: "12px", sm: "24px", md: "20px" } }}>
      <Box
        sx={(theme) => ({
          position: "relative",
          overflow: "hidden",
          borderRadius: "25px",
          minHeight: { xs: 340, md: 480 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.surfaces.placeholder,
          backgroundImage: `url("${resolvedHeaderImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        })}
      >
        <Box
          aria-hidden
          sx={(theme) => ({
            position: "absolute",
            inset: 0,
            backgroundColor: theme.palette.surfaces.scrim,
          })}
        />

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 1000,
            px: { xs: "24px", sm: "40px", md: 0 },
            py: { xs: 6, md: 0 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 3, md: 4 },
            color: "common.white",
            textAlign: "center",
          }}
        >
          <Typography variant="h3" component="h2">
            {subscriptionsTranslation.title}
          </Typography>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "flex-start" },
              gap: 1.75,
            }}
          >
            <TextField
              fullWidth
              type="email"
              value={email}
              placeholder={formTranslations.email.placeholder}
              error={Boolean(emailError)}
              helperText={emailError ?? " "}
              disabled={isSubmitting}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailError(null);
                setSubmitStatus(null);
              }}
              slotProps={{
                htmlInput: {
                  "aria-label": formTranslations.email.placeholder,
                },
              }}
              sx={(theme) => ({
                flex: { sm: "1 1 560px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: theme.palette.common.white,
                  "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.8)" },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.common.white,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  px: 3,
                  py: 2,
                  "&::placeholder": { color: "rgba(255,255,255,0.75)", opacity: 1 },
                },
                "& .MuiFormHelperText-root": {
                  mx: 3,
                  minHeight: 20,
                  color: theme.palette.common.white,
                },
                "& .MuiFormHelperText-root.Mui-error": {
                  color: theme.palette.common.white,
                },
              })}
            />

            <GradientButton
              type="submit"
              disabled={isSubmitting}
              endIcon={<ArrowOutwardIcon />}
              sx={{ flexShrink: 0, height: 58 }}
            >
              {subscriptionsTranslation.callToAction}
            </GradientButton>

            {submitStatus && (
              <Alert
                severity={submitStatus}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  mt: 1,
                  py: 0.25,
                  textAlign: "left",
                  "& .MuiAlert-message": { py: 0.75 },
                }}
              >
                {submitStatus === "success"
                  ? subscriptionsTranslation.successMessage
                  : subscriptionsTranslation.errorMessage}
              </Alert>
            )}
          </Box>

          <FormDisclaimer isHighContrast />
        </Box>
      </Box>
    </Box>
  );
}
